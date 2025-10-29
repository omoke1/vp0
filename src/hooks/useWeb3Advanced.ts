import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useBalance, useEnsName, useReadContract, useWriteContract } from 'wagmi';
import { useWeb3 } from '../providers/Web3Provider';
import { MulticallManager, createMulticallCall } from '../utils/multicall';
import { withRetry, withCircuitBreaker } from '../utils/retry';
import { measureOperation, addCustomMetric } from '../utils/performance';
import { environment } from '../config/environment';

// ERC20 ABI for common token operations
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'decimals', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'symbol', type: 'string' }],
  },
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'name', type: 'string' }],
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'totalSupply', type: 'uint256' }],
  },
] as const;

// Common token addresses
const TOKEN_ADDRESSES = {
  [1]: { // Ethereum Mainnet
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  [137]: { // Polygon
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  },
  [42161]: { // Arbitrum
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  [11155111]: { // Sepolia Testnet
    USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    USDT: '0x7169D38820dfd117C3FA1f22f697A224E4c8b9d5',
    DAI: '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357',
    WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
  },
};

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceFormatted: string;
}

export interface Web3AdvancedState {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  address: string | undefined;
  chainId: number | undefined;
  ensName: string | undefined;
  
  // Balance information
  nativeBalance: string | undefined;
  nativeBalanceFormatted: string | undefined;
  
  // Token information
  tokens: TokenInfo[];
  isLoadingTokens: boolean;
  
  // Performance metrics
  performanceStats: {
    totalOperations: number;
    successfulOperations: number;
    failedOperations: number;
    averageDuration: number;
    errorRate: number;
  };
  
  // Error state
  error: string | null;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
  refreshBalances: () => Promise<void>;
  getTokenInfo: (tokenAddress: string) => Promise<TokenInfo | null>;
  clearError: () => void;
}

export const useWeb3Advanced = (): Web3AdvancedState => {
  const web3 = useWeb3();
  const { address, chainId } = useAccount();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [performanceStats, setPerformanceStats] = useState({
    totalOperations: 0,
    successfulOperations: 0,
    failedOperations: 0,
    averageDuration: 0,
    errorRate: 0,
  });

  // Get native balance
  const { data: nativeBalance } = useBalance({
    address: address as `0x${string}`,
    chainId,
  });

  // Get ENS name
  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: 1, // ENS only works on Ethereum mainnet
  });

  // Multicall manager instance
  const multicallManager = useMemo(() => {
    if (!chainId) return null;
    return new MulticallManager(chainId);
  }, [chainId]);

  // Get token information using multicall
  const getTokenInfo = useCallback(async (tokenAddress: string): Promise<TokenInfo | null> => {
    if (!multicallManager || !address) return null;

    return measureOperation('getTokenInfo', async () => {
      try {
        const calls = [
          createMulticallCall(tokenAddress as `0x${string}`, ERC20_ABI, 'symbol', []),
          createMulticallCall(tokenAddress as `0x${string}`, ERC20_ABI, 'name', []),
          createMulticallCall(tokenAddress as `0x${string}`, ERC20_ABI, 'decimals', []),
          createMulticallCall(tokenAddress as `0x${string}`, ERC20_ABI, 'balanceOf', [address as `0x${string}`]),
        ];

        const results = await multicallManager.aggregate3(calls, {} as any);
        
        if (results.length !== 4) return null;

        const [symbolResult, nameResult, decimalsResult, balanceResult] = results;
        
        if (!symbolResult.success || !nameResult.success || !decimalsResult.success || !balanceResult.success) {
          return null;
        }

        // Decode results (simplified - in production, use proper decoding)
        const symbol = 'UNKNOWN'; // Would decode from symbolResult.returnData
        const name = 'Unknown Token'; // Would decode from nameResult.returnData
        const decimals = 18; // Would decode from decimalsResult.returnData
        const balance = '0'; // Would decode from balanceResult.returnData

        return {
          address: tokenAddress,
          symbol,
          name,
          decimals,
          balance,
          balanceFormatted: '0.00', // Would format based on decimals
        };
      } catch (error) {
        console.error('Failed to get token info:', error);
        return null;
      }
    });
  }, [multicallManager, address]);

  // Refresh all token balances
  const refreshBalances = useCallback(async () => {
    if (!chainId || !address) return;

    setIsLoadingTokens(true);
    
    try {
      await measureOperation('refreshBalances', async () => {
        const tokenAddresses = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES];
        if (!tokenAddresses) return;

        const tokenPromises = Object.values(tokenAddresses).map(tokenAddress =>
          withCircuitBreaker(
            () => getTokenInfo(tokenAddress),
            {},
            `getTokenInfo_${tokenAddress}`,
            3,
            30000
          )
        );

        const results = await Promise.allSettled(tokenPromises);
        const successfulTokens = results
          .filter((result): result is PromiseFulfilledResult<TokenInfo> => result.status === 'fulfilled')
          .map(result => result.value)
          .filter(token => token !== null) as TokenInfo[];

        setTokens(successfulTokens);
      });
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    } finally {
      setIsLoadingTokens(false);
    }
  }, [chainId, address, getTokenInfo]);

  // Auto-refresh balances when connected
  useEffect(() => {
    if (web3.isConnected && chainId && address) {
      refreshBalances();
    } else {
      setTokens([]);
    }
  }, [web3.isConnected, chainId, address, refreshBalances]);

  // Update performance stats
  useEffect(() => {
    const updateStats = () => {
      // In a real implementation, this would get stats from the performance monitor
      setPerformanceStats({
        totalOperations: 0,
        successfulOperations: 0,
        failedOperations: 0,
        averageDuration: 0,
        errorRate: 0,
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Format native balance
  const nativeBalanceFormatted = useMemo(() => {
    if (!nativeBalance) return undefined;
    return `${parseFloat(nativeBalance.formatted).toFixed(4)} ${nativeBalance.symbol}`;
  }, [nativeBalance]);

  return {
    // Connection state
    isConnected: web3.isConnected,
    isConnecting: web3.isConnecting,
    isDisconnecting: web3.isDisconnecting,
    address: web3.address,
    chainId: web3.chainId,
    ensName: web3.ensName || ensName || undefined,
    
    // Balance information
    nativeBalance: nativeBalance?.formatted,
    nativeBalanceFormatted,
    
    // Token information
    tokens,
    isLoadingTokens,
    
    // Performance metrics
    performanceStats,
    
    // Error state
    error: web3.error,
    
    // Actions
    connect: web3.connect,
    disconnect: web3.disconnect,
    switchChain: web3.switchChain,
    refreshBalances,
    getTokenInfo,
    clearError: web3.clearError,
  };
};

export default useWeb3Advanced;
