import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface User {
  address: string;
  ensName?: string;
  balance?: string;
  isConnected: boolean;
  chainId?: number;
  networkName?: string;
}

export interface AppState {
  // UI State
  isLoading: boolean;
  isAppLaunched: boolean;
  currentRoute: string;
  error: string | null;
  
  // User State
  user: User | null;
  isWalletConnecting: boolean;
  
  // Performance State
  lastActivity: number;
  connectionRetryCount: number;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  launchApp: () => void;
  setCurrentRoute: (route: string) => void;
  setUser: (user: User | null) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  updateLastActivity: () => void;
  resetConnectionRetry: () => void;
  incrementConnectionRetry: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial State
      isLoading: false,
      isAppLaunched: false,
      currentRoute: '/',
      error: null,
      user: null,
      isWalletConnecting: false,
      lastActivity: Date.now(),
      connectionRetryCount: 0,

      // Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setError: (error: string | null) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      launchApp: () => {
        console.log('🚀 Launching Veyra App...');
        
        set({ 
          isAppLaunched: true, 
          isLoading: true,
          currentRoute: '/dashboard',
          error: null
        });
        
        // Simulate app initialization with progressive loading
        setTimeout(() => {
          console.log('✅ Veyra App launched successfully');
          set({ isLoading: false });
        }, 1200);
      },
      
      setCurrentRoute: (route: string) => {
        set({ currentRoute: route });
        get().updateLastActivity();
      },
      
      setUser: (user: User | null) => set({ user }),
      
      connectWallet: async () => {
        const { connectionRetryCount } = get();
        
        // Implement retry logic with exponential backoff
        if (connectionRetryCount >= 3) {
          set({ 
            error: 'Maximum connection attempts reached. Please refresh and try again.',
            isWalletConnecting: false 
          });
          return;
        }
        
        set({ isWalletConnecting: true, error: null });
        
        try {
          // This will be implemented with Web3Modal
          // For now, simulate wallet connection with realistic timing
          await new Promise(resolve => setTimeout(resolve, 1500 + connectionRetryCount * 500));
          
          const mockUser: User = {
            address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
            ensName: 'vitalik.eth',
            balance: '2.5 ETH',
            isConnected: true,
            chainId: 1,
            networkName: 'Ethereum Mainnet'
          };
          
          set({ 
            user: mockUser, 
            isWalletConnecting: false,
            connectionRetryCount: 0,
            lastActivity: Date.now()
          });
        } catch (error) {
          console.error('Wallet connection failed:', error);
          set({ 
            isWalletConnecting: false,
            error: 'Failed to connect wallet. Please try again.',
            connectionRetryCount: connectionRetryCount + 1
          });
        }
      },
      
      disconnectWallet: () => {
        set({ 
          user: null, 
          connectionRetryCount: 0,
          error: null,
          lastActivity: Date.now()
        });
      },
      
      updateLastActivity: () => set({ lastActivity: Date.now() }),
      
      resetConnectionRetry: () => set({ connectionRetryCount: 0 }),
      
      incrementConnectionRetry: () => {
        const { connectionRetryCount } = get();
        set({ connectionRetryCount: connectionRetryCount + 1 });
      }
    }),
    {
      name: 'veyra-app-store',
    }
  )
);
