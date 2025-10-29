import { errorConfig } from '../config/wagmi';

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
  maxRetryDelay?: number;
  timeout?: number;
  retryCondition?: (error: any) => boolean;
}

export interface RetryStats {
  attempts: number;
  totalTime: number;
  lastError: Error | null;
  success: boolean;
}

export class RetryManager {
  private options: Required<RetryOptions>;
  private stats: RetryStats;

  constructor(options: RetryOptions = {}) {
    this.options = {
      maxRetries: options.maxRetries || errorConfig.maxRetries,
      retryDelay: options.retryDelay || errorConfig.retryDelay,
      exponentialBackoff: options.exponentialBackoff ?? errorConfig.exponentialBackoff,
      maxRetryDelay: options.maxRetryDelay || errorConfig.maxRetryDelay,
      timeout: options.timeout || errorConfig.timeout,
      retryCondition: options.retryCondition || this.defaultRetryCondition,
    };

    this.stats = {
      attempts: 0,
      totalTime: 0,
      lastError: null,
      success: false,
    };
  }

  /**
   * Execute a function with retry logic
   */
  async execute<T>(
    fn: () => Promise<T>,
    context: string = 'operation'
  ): Promise<T> {
    const startTime = Date.now();
    this.stats = {
      attempts: 0,
      totalTime: 0,
      lastError: null,
      success: false,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
      this.stats.attempts = attempt + 1;

      try {
        // Execute with timeout
        const result = await Promise.race([
          fn(),
          this.createTimeoutPromise(),
        ]);

        this.stats.success = true;
        this.stats.totalTime = Date.now() - startTime;
        
        if (attempt > 0) {
          console.log(`✅ ${context} succeeded after ${attempt + 1} attempts (${this.stats.totalTime}ms)`);
        }

        return result;
      } catch (error) {
        lastError = error as Error;
        this.stats.lastError = lastError;

        // Check if we should retry
        if (attempt < this.options.maxRetries && this.options.retryCondition(error)) {
          const delay = this.calculateDelay(attempt);
          console.warn(`⚠️ ${context} attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error instanceof Error ? error.message : String(error));
          
          await this.delay(delay);
        } else {
          break;
        }
      }
    }

    this.stats.totalTime = Date.now() - startTime;
    console.error(`❌ ${context} failed after ${this.stats.attempts} attempts (${this.stats.totalTime}ms):`, lastError);
    
    throw lastError || new Error(`${context} failed after ${this.stats.attempts} attempts`);
  }

  /**
   * Execute multiple functions in parallel with retry logic
   */
  async executeParallel<T>(
    functions: Array<() => Promise<T>>,
    context: string = 'parallel operations'
  ): Promise<T[]> {
    const results = await Promise.allSettled(
      functions.map((fn, index) => 
        this.execute(fn, `${context}[${index}]`)
      )
    );

    const successful = results
      .filter((result): result is PromiseFulfilledResult<Awaited<T>> => result.status === 'fulfilled')
      .map(result => result.value);

    const failed = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map(result => result.reason);

    if (failed.length > 0) {
      console.warn(`${context}: ${failed.length} operations failed, ${successful.length} succeeded`);
    }

    return successful;
  }

  /**
   * Execute functions with circuit breaker pattern
   */
  async executeWithCircuitBreaker<T>(
    fn: () => Promise<T>,
    context: string = 'circuit breaker operation',
    failureThreshold: number = 5,
    recoveryTimeout: number = 60000
  ): Promise<T> {
    const circuitKey = `circuit_${context}`;
    const circuitState = this.getCircuitState(circuitKey);

    // Check if circuit is open
    if (circuitState.state === 'open') {
      if (Date.now() - circuitState.lastFailureTime < recoveryTimeout) {
        throw new Error(`Circuit breaker is open for ${context}. Try again later.`);
      } else {
        // Reset circuit to half-open
        this.setCircuitState(circuitKey, { state: 'half-open', failureCount: 0, lastFailureTime: 0 });
      }
    }

    try {
      const result = await this.execute(fn, context);
      
      // Reset circuit on success
      if (circuitState.state === 'half-open') {
        this.setCircuitState(circuitKey, { state: 'closed', failureCount: 0, lastFailureTime: 0 });
      }
      
      return result;
    } catch (error) {
      const newFailureCount = circuitState.failureCount + 1;
      
      if (newFailureCount >= failureThreshold) {
        this.setCircuitState(circuitKey, { 
          state: 'open', 
          failureCount: newFailureCount, 
          lastFailureTime: Date.now() 
        });
        console.error(`🔴 Circuit breaker opened for ${context} after ${newFailureCount} failures`);
      } else {
        this.setCircuitState(circuitKey, { 
          state: circuitState.state, 
          failureCount: newFailureCount, 
          lastFailureTime: Date.now() 
        });
      }
      
      throw error;
    }
  }

  /**
   * Calculate delay between retries
   */
  private calculateDelay(attempt: number): number {
    if (!this.options.exponentialBackoff) {
      return this.options.retryDelay;
    }

    const delay = this.options.retryDelay * Math.pow(2, attempt);
    return Math.min(delay, this.options.maxRetryDelay);
  }

  /**
   * Create timeout promise
   */
  private createTimeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${this.options.timeout}ms`));
      }, this.options.timeout);
    });
  }

  /**
   * Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Default retry condition
   */
  private defaultRetryCondition(error: any): boolean {
    // Don't retry on user rejection
    if (error.code === 4001 || error.message?.includes('User rejected')) {
      return false;
    }

    // Don't retry on invalid parameters
    if (error.code === -32602) {
      return false;
    }

    // Retry on network errors, timeouts, and rate limits
    if (
      error.message?.includes('network') ||
      error.message?.includes('timeout') ||
      error.message?.includes('rate limit') ||
      error.message?.includes('connection') ||
      error.code === -32603 // Internal JSON-RPC error
    ) {
      return true;
    }

    // Retry on unknown errors (conservative approach)
    return true;
  }

  /**
   * Get circuit breaker state
   */
  private getCircuitState(key: string): { state: 'closed' | 'open' | 'half-open'; failureCount: number; lastFailureTime: number } {
    const stored = localStorage.getItem(`retry_circuit_${key}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return { state: 'closed', failureCount: 0, lastFailureTime: 0 };
  }

  /**
   * Set circuit breaker state
   */
  private setCircuitState(key: string, state: { state: 'closed' | 'open' | 'half-open'; failureCount: number; lastFailureTime: number }): void {
    localStorage.setItem(`retry_circuit_${key}`, JSON.stringify(state));
  }

  /**
   * Get retry statistics
   */
  getStats(): RetryStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      attempts: 0,
      totalTime: 0,
      lastError: null,
      success: false,
    };
  }
}

/**
 * Utility function for simple retry execution
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
  context: string = 'operation'
): Promise<T> {
  const retryManager = new RetryManager(options);
  return retryManager.execute(fn, context);
}

/**
 * Utility function for parallel retry execution
 */
export async function withParallelRetry<T>(
  functions: Array<() => Promise<T>>,
  options: RetryOptions = {},
  context: string = 'parallel operations'
): Promise<T[]> {
  const retryManager = new RetryManager(options);
  return retryManager.executeParallel(functions, context);
}

/**
 * Utility function for circuit breaker execution
 */
export async function withCircuitBreaker<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
  context: string = 'circuit breaker operation',
  failureThreshold: number = 5,
  recoveryTimeout: number = 60000
): Promise<T> {
  const retryManager = new RetryManager(options);
  return retryManager.executeWithCircuitBreaker(fn, context, failureThreshold, recoveryTimeout);
}

export default RetryManager;
