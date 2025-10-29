import { createConfig, http } from 'wagmi';
import { mainnet, polygon, arbitrum, sepolia } from 'wagmi/chains';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient } from '@tanstack/react-query';
import { environment } from './environment';

// Get projectId from environment configuration
const projectId = environment.walletConnectProjectId;

// Define supported chains
export const chains = [mainnet, polygon, arbitrum, sepolia] as const;

// Create wagmi config
export const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(environment.rpcUrls.ethereum),
    [polygon.id]: http(environment.rpcUrls.polygon),
    [arbitrum.id]: http(environment.rpcUrls.arbitrum),
    [sepolia.id]: http(environment.rpcUrls.sepolia),
  },
});

// Create Web3Modal
export const web3Modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'light',
  themeVariables: {
    '--w3m-z-index': '1000',
    '--w3m-accent': '#3b82f6',
    '--w3m-border-radius-master': '12px',
  },
  enableAnalytics: true,
  enableOnramp: true,
  enableNetworkView: true,
  enableAccountView: true,
  enableExplorer: true,
  enableWalletFeatures: true,
});

// Export configurations from environment
export const connectionPoolConfig = environment.connectionPool;
export const multicallConfig = environment.multicall;
export const errorConfig = environment.errorHandling;
export const performanceConfig = environment.performance;

// Chain-specific RPC configurations
export const rpcConfig = {
  [mainnet.id]: {
    name: 'Ethereum Mainnet',
    rpcUrl: environment.rpcUrls.ethereum,
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    priority: 1,
  },
  [polygon.id]: {
    name: 'Polygon',
    rpcUrl: environment.rpcUrls.polygon,
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    priority: 2,
  },
  [arbitrum.id]: {
    name: 'Arbitrum One',
    rpcUrl: environment.rpcUrls.arbitrum,
    blockExplorer: 'https://arbiscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    priority: 3,
  },
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    rpcUrl: environment.rpcUrls.sepolia,
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    priority: 4,
  },
};
