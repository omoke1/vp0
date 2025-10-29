import { Address, encodeFunctionData, parseAbi } from 'viem';
import { multicallConfig } from '../config/wagmi';

// Multicall contract addresses for different chains
const MULTICALL_ADDRESSES: Record<number, Address> = {
  1: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696', // Ethereum Mainnet
  137: '0x275617327c4B24C46A74d9695d3B2C97C4C2B5f2', // Polygon
  42161: '0xca11bde05977b3631167028862be2a173976ca11', // Arbitrum One
  11155111: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696', // Sepolia Testnet
};

// Multicall ABI
const MULTICALL_ABI = parseAbi([
  'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) external view returns (tuple(bool success, bytes returnData)[] returnData)',
  'function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) external view returns (tuple(bool success, bytes returnData)[] returnData)',
]);

export interface MulticallCall {
  target: Address;
  allowFailure?: boolean;
  callData: `0x${string}`;
}

export interface MulticallResult {
  success: boolean;
  returnData: `0x${string}`;
}

export interface MulticallOptions {
  batchSize?: number;
  waitTime?: number;
  retryAttempts?: number;
  timeout?: number;
}

export class MulticallManager {
  private chainId: number;
  private multicallAddress: Address;
  private options: Required<MulticallOptions>;

  constructor(chainId: number, options: MulticallOptions = {}) {
    this.chainId = chainId;
    this.multicallAddress = MULTICALL_ADDRESSES[chainId];
    this.options = {
      batchSize: options.batchSize || multicallConfig.batchSize,
      waitTime: options.waitTime || multicallConfig.waitTime,
      retryAttempts: options.retryAttempts || multicallConfig.retryAttempts,
      timeout: options.timeout || multicallConfig.timeout,
    };

    if (!this.multicallAddress) {
      throw new Error(`Multicall not supported on chain ${chainId}`);
    }
  }

  /**
   * Execute multiple contract calls in a single transaction
   */
  async aggregate3(
    calls: MulticallCall[],
    client: any
  ): Promise<MulticallResult[]> {
    if (calls.length === 0) return [];

    // Batch calls if they exceed the batch size
    if (calls.length > this.options.batchSize) {
      return this.executeBatchedCalls(calls, client);
    }

    return this.executeSingleBatch(calls, client);
  }

  /**
   * Execute calls with individual failure tolerance
   */
  async tryAggregate(
    calls: Array<{ target: Address; callData: `0x${string}` }>,
    requireSuccess: boolean = false,
    client: any
  ): Promise<MulticallResult[]> {
    if (calls.length === 0) return [];

    // Batch calls if they exceed the batch size
    if (calls.length > this.options.batchSize) {
      return this.executeBatchedTryAggregate(calls, requireSuccess, client);
    }

    return this.executeSingleTryAggregate(calls, requireSuccess, client);
  }

  /**
   * Execute calls in batches
   */
  private async executeBatchedCalls(
    calls: MulticallCall[],
    client: any
  ): Promise<MulticallResult[]> {
    const batches = this.createBatches(calls, this.options.batchSize);
    const results: MulticallResult[] = [];

    for (const batch of batches) {
      try {
        const batchResults = await this.executeSingleBatch(batch, client);
        results.push(...batchResults);
        
        // Wait between batches to avoid rate limiting
        if (batches.indexOf(batch) < batches.length - 1) {
          await this.delay(this.options.waitTime);
        }
      } catch (error) {
        console.error('Batch execution failed:', error);
        // Add failed results for this batch
        const failedResults = batch.map(() => ({
          success: false,
          returnData: '0x' as `0x${string}`,
        }));
        results.push(...failedResults);
      }
    }

    return results;
  }

  /**
   * Execute tryAggregate calls in batches
   */
  private async executeBatchedTryAggregate(
    calls: Array<{ target: Address; callData: `0x${string}` }>,
    requireSuccess: boolean,
    client: any
  ): Promise<MulticallResult[]> {
    const batches = this.createBatches(calls, this.options.batchSize);
    const results: MulticallResult[] = [];

    for (const batch of batches) {
      try {
        const batchResults = await this.executeSingleTryAggregate(batch, requireSuccess, client);
        results.push(...batchResults);
        
        // Wait between batches to avoid rate limiting
        if (batches.indexOf(batch) < batches.length - 1) {
          await this.delay(this.options.waitTime);
        }
      } catch (error) {
        console.error('Batch tryAggregate execution failed:', error);
        // Add failed results for this batch
        const failedResults = batch.map(() => ({
          success: false,
          returnData: '0x' as `0x${string}`,
        }));
        results.push(...failedResults);
      }
    }

    return results;
  }

  /**
   * Execute a single batch of calls
   */
  private async executeSingleBatch(
    calls: MulticallCall[],
    client: any
  ): Promise<MulticallResult[]> {
    const formattedCalls = calls.map(call => ({
      target: call.target,
      allowFailure: call.allowFailure ?? true,
      callData: call.callData,
    }));

    return this.executeWithRetry(
      () => client.readContract({
        address: this.multicallAddress,
        abi: MULTICALL_ABI,
        functionName: 'aggregate3',
        args: [formattedCalls],
      }),
      'aggregate3'
    );
  }

  /**
   * Execute a single batch of tryAggregate calls
   */
  private async executeSingleTryAggregate(
    calls: Array<{ target: Address; callData: `0x${string}` }>,
    requireSuccess: boolean,
    client: any
  ): Promise<MulticallResult[]> {
    return this.executeWithRetry(
      () => client.readContract({
        address: this.multicallAddress,
        abi: MULTICALL_ABI,
        functionName: 'tryAggregate',
        args: [requireSuccess, calls],
      }),
      'tryAggregate'
    );
  }

  /**
   * Execute function with retry logic
   */
  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    operation: string
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.options.retryAttempts; attempt++) {
      try {
        return await Promise.race([
          fn(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), this.options.timeout)
          ),
        ]);
      } catch (error) {
        lastError = error as Error;
        console.warn(`${operation} attempt ${attempt + 1} failed:`, error);

        if (attempt < this.options.retryAttempts - 1) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await this.delay(delay);
        }
      }
    }

    throw lastError || new Error(`${operation} failed after ${this.options.retryAttempts} attempts`);
  }

  /**
   * Create batches from an array
   */
  private createBatches<T>(array: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get multicall address for current chain
   */
  getMulticallAddress(): Address {
    return this.multicallAddress;
  }

  /**
   * Check if multicall is supported on current chain
   */
  static isSupported(chainId: number): boolean {
    return MULTICALL_ADDRESSES[chainId] !== undefined;
  }
}

/**
 * Utility function to create multicall calls
 */
export function createMulticallCall(
  target: Address,
  abi: any,
  functionName: string,
  args: any[] = [],
  allowFailure: boolean = true
): MulticallCall {
  return {
    target,
    allowFailure,
    callData: encodeFunctionData({
      abi,
      functionName,
      args,
    }),
  };
}

/**
 * Utility function to decode multicall results
 */
export function decodeMulticallResult<T>(
  result: MulticallResult,
  abi: any,
  functionName: string
): T | null {
  if (!result.success || result.returnData === '0x') {
    return null;
  }

  try {
    const { decodeFunctionResult } = require('viem');
    return decodeFunctionResult({
      abi,
      functionName,
      data: result.returnData,
    });
  } catch (error) {
    console.error('Failed to decode multicall result:', error);
    return null;
  }
}

export default MulticallManager;
