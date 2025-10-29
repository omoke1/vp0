// Environment configuration for VPO App
export const environment = {
  // Web3Modal Configuration
  walletConnectProjectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || 'your-project-id-here',
  
  // Alchemy API Keys (for RPC endpoints)
  alchemyApiKey: process.env.REACT_APP_ALCHEMY_API_KEY || 'demo',
  
  // Custom RPC URLs (if not using Alchemy)
  rpcUrls: {
    ethereum: process.env.REACT_APP_ETHEREUM_RPC_URL || `https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY || 'demo'}`,
    polygon: process.env.REACT_APP_POLYGON_RPC_URL || `https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY || 'demo'}`,
    arbitrum: process.env.REACT_APP_ARBITRUM_RPC_URL || `https://arb-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY || 'demo'}`,
    sepolia: process.env.REACT_APP_SEPOLIA_RPC_URL || `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY || 'demo'}`,
  },
  
  // Performance Monitoring
  enablePerformanceMonitoring: process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true',
  performanceSampleRate: parseFloat(process.env.REACT_APP_PERFORMANCE_SAMPLE_RATE || '0.1'),
  
  // Development Settings
  enableDevtools: process.env.REACT_APP_ENABLE_DEVTOOLS === 'true' || process.env.NODE_ENV === 'development',
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  
  // App Configuration
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Feature Flags
  features: {
    enableMulticall: true,
    enableConnectionPooling: true,
    enableCircuitBreaker: true,
    enableRetryLogic: true,
    enablePerformanceMetrics: true,
    enableWebVitals: true,
  },
  
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'https://api.vpo.com',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  
  // Blockchain Configuration
  blockchain: {
    supportedChains: [1, 137, 42161, 11155111], // Ethereum, Polygon, Arbitrum, Sepolia
    defaultChain: 1, // Ethereum Mainnet
    multicallAddresses: {
      1: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
      137: '0x275617327c4B24C46A74d9695d3B2C97C4C2B5f2',
      42161: '0xca11bde05977b3631167028862be2a173976ca11',
      11155111: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    },
  },
  
  // Error Handling Configuration
  errorHandling: {
    maxRetries: 3,
    retryDelay: 1000,
    exponentialBackoff: true,
    maxRetryDelay: 10000,
    timeout: 30000,
    networkErrorThreshold: 5,
    rateLimitThreshold: 10,
  },
  
  // Performance Configuration
  performance: {
    enableMetrics: true,
    sampleRate: 0.1,
    maxMetrics: 1000,
    flushInterval: 30000,
    enableWebVitals: true,
  },
  
  // Connection Pool Configuration
  connectionPool: {
    maxConnections: 10,
    retryAttempts: 3,
    retryDelay: 1000,
    timeout: 30000,
    keepAlive: true,
  },
  
  // Multicall Configuration
  multicall: {
    batchSize: 100,
    waitTime: 16, // 16ms for 60fps
    retryAttempts: 2,
    timeout: 10000,
  },
};

export default environment;
