import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient } from '@tanstack/react-query';
import { config, web3Modal, connectionPoolConfig, errorConfig } from '../config/wagmi';
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from 'wagmi';
import { useAppStore } from '../store/useAppStore';
import { sessionManager, WalletSession } from '../utils/sessionManager';
import { measureOperation } from '../utils/performance';

// Connection pool for managing RPC connections
class ConnectionPool {
  private connections: Map<string, any> = new Map();
  private retryCounts: Map<string, number> = new Map();
  private lastError: Map<string, number> = new Map();

  async getConnection(chainId: number): Promise<any> {
    const key = chainId.toString();
    
    // Check if connection exists and is healthy
    if (this.connections.has(key)) {
      const connection = this.connections.get(key);
      if (this.isHealthy(connection)) {
        return connection;
      }
    }

    // Create new connection
    return this.createConnection(chainId);
  }

  private isHealthy(connection: any): boolean {
    // Simple health check - in production, implement more sophisticated checks
    return connection && !connection.destroyed;
  }

  private async createConnection(chainId: number): Promise<any> {
    const key = chainId.toString();
    
    try {
      // In a real implementation, this would create actual RPC connections
      const connection = {
        chainId,
        createdAt: Date.now(),
        destroyed: false,
        // Add connection-specific properties
      };

      this.connections.set(key, connection);
      this.retryCounts.set(key, 0);
      
      return connection;
    } catch (error) {
      console.error(`Failed to create connection for chain ${chainId}:`, error);
      throw error;
    }
  }

  async closeConnection(chainId: number): Promise<void> {
    const key = chainId.toString();
    const connection = this.connections.get(key);
    
    if (connection) {
      connection.destroyed = true;
      this.connections.delete(key);
    }
  }

  async closeAllConnections(): Promise<void> {
    for (const [key, connection] of this.connections) {
      connection.destroyed = true;
    }
    this.connections.clear();
    this.retryCounts.clear();
    this.lastError.clear();
  }

  getConnectionCount(): number {
    return this.connections.size;
  }

  getRetryCount(chainId: number): number {
    return this.retryCounts.get(chainId.toString()) || 0;
  }

  incrementRetryCount(chainId: number): void {
    const key = chainId.toString();
    const current = this.retryCounts.get(key) || 0;
    this.retryCounts.set(key, current + 1);
  }

  resetRetryCount(chainId: number): void {
    this.retryCounts.set(chainId.toString(), 0);
  }
}

// Create connection pool instance
const connectionPool = new ConnectionPool();

// Web3 Context
interface Web3ContextType {
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  address: string | undefined;
  chainId: number | undefined;
  ensName: string | undefined;
  balance: string | undefined;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
  connectionPool: ConnectionPool;
  error: string | null;
  clearError: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Web3 Provider Component
interface Web3ProviderProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children, queryClient }) => {
  const { setUser, setError, clearError, setLoading } = useAppStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setWeb3Error] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  // Get ENS name and balance
  const [ensName, setEnsName] = useState<string | undefined>();
  const [balance, setBalance] = useState<string | undefined>();

  // Error handling with retry logic
  const handleError = useCallback((error: any, operation: string) => {
    console.error(`Web3 ${operation} error:`, error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.code === 4001) {
      errorMessage = 'User rejected the request';
    } else if (error.code === -32602) {
      errorMessage = 'Invalid parameters';
    } else if (error.code === -32603) {
      errorMessage = 'Internal JSON-RPC error';
    } else if (error.message?.includes('User rejected')) {
      errorMessage = 'User rejected the connection';
    } else if (error.message?.includes('Already processing')) {
      errorMessage = 'Connection already in progress';
    } else if (error.message?.includes('Unsupported chain')) {
      errorMessage = 'Unsupported blockchain network';
    } else if (error.message) {
      errorMessage = error.message;
    }

    setWeb3Error(errorMessage);
    setError(errorMessage);
  }, [setError]);

  // Clear error
  const clearWeb3Error = useCallback(() => {
    setWeb3Error(null);
    clearError();
  }, [clearError]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    clearWeb3Error();

    try {
      await measureOperation('connectWallet', async () => {
        // Get the first available connector
        const connector = connectors[0];
        if (!connector) {
          throw new Error('No wallet connectors available');
        }

        await connect({ connector });
        
        // Create session data
        const session: WalletSession = {
          address: address || '',
          chainId: chainId || 1,
          ensName,
          connectedAt: Date.now(),
          lastActivity: Date.now(),
          connectionMethod: 'injected', // Simplified - would detect actual method
          preferences: sessionManager.getPreferences(),
        };

        // Save session
        sessionManager.saveSession(session);
        
        // Update user state
        setUser({
          address: address || '',
          ensName,
          balance,
          isConnected: true,
          chainId,
          networkName: chainId ? getNetworkName(chainId) : undefined,
        });
      });

    } catch (error) {
      handleError(error, 'connection');
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected, connectors, connect, address, ensName, balance, chainId, setUser, handleError, clearWeb3Error]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    if (isDisconnecting || !isConnected) return;

    setIsDisconnecting(true);
    clearWeb3Error();

    try {
      await measureOperation('disconnectWallet', async () => {
        // Close all connections
        await connectionPool.closeAllConnections();
        
        // Clear session
        sessionManager.clearSession();
        
        // Disconnect wallet
        await disconnect();
        
        // Clear user state
        setUser(null);
      });
      
    } catch (error) {
      handleError(error, 'disconnection');
    } finally {
      setIsDisconnecting(false);
    }
  }, [isDisconnecting, isConnected, disconnect, setUser, handleError, clearWeb3Error]);

  // Switch chain
  const switchChainWallet = useCallback(async (targetChainId: number) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      await measureOperation('switchChain', async () => {
        await switchChain({ chainId: targetChainId });
        
        // Update session with new chain
        const session = sessionManager.loadSession();
        if (session) {
          session.chainId = targetChainId;
          session.lastActivity = Date.now();
          sessionManager.saveSession(session);
        }
        
        // Update user state with new chain
        setUser(prev => prev ? {
          ...prev,
          chainId: targetChainId,
          networkName: getNetworkName(targetChainId),
        } : null);
      });

    } catch (error) {
      handleError(error, 'chain switch');
      throw error;
    }
  }, [isConnected, switchChain, setUser, handleError]);

  // Get network name from chain ID
  const getNetworkName = (chainId: number): string => {
    const networkNames: Record<number, string> = {
      1: 'Ethereum Mainnet',
      137: 'Polygon',
      42161: 'Arbitrum One',
      11155111: 'Sepolia Testnet',
    };
    return networkNames[chainId] || 'Unknown Network';
  };

  // Initialize Web3 provider and handle auto-connect
  useEffect(() => {
    const initializeWeb3 = async () => {
      if (isInitialized) return;

      try {
        // Check if auto-connect is enabled and session exists
        if (sessionManager.shouldAutoConnect()) {
          const session = sessionManager.loadSession();
          if (session) {
            console.log('Auto-connecting to wallet:', session.address);
            await connectWallet();
          }
        }
      } catch (error) {
        console.error('Failed to auto-connect:', error);
        // Clear invalid session
        sessionManager.clearSession();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeWeb3();
  }, [isInitialized, connectWallet]);

  // Update user state when wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      // Update session activity
      sessionManager.updateActivity(address);
      
      setUser({
        address,
        ensName,
        balance,
        isConnected: true,
        chainId,
        networkName: chainId ? getNetworkName(chainId) : undefined,
      });
    } else if (!isConnected) {
      setUser(null);
    }
  }, [isConnected, address, ensName, balance, chainId, setUser]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      connectionPool.closeAllConnections();
    };
  }, []);

  const contextValue: Web3ContextType = {
    isConnected,
    isConnecting,
    isDisconnecting,
    address,
    chainId,
    ensName,
    balance,
    connect: connectWallet,
    disconnect: disconnectWallet,
    switchChain: switchChainWallet,
    connectionPool,
    error: error || null,
    clearError: clearWeb3Error,
  };

  return (
    <WagmiProvider config={config}>
      <Web3Context.Provider value={contextValue}>
        {children}
      </Web3Context.Provider>
    </WagmiProvider>
  );
};

export default Web3Provider;
