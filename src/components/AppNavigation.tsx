import React, { memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useWeb3 } from '../providers/Web3Provider';
import { BarChart3, TrendingUp, Cpu, Menu, X, Wallet, AlertCircle, Network } from 'lucide-react';
import { useState } from 'react';

const AppNavigation: React.FC = () => {
  const { user, error, clearError } = useAppStore();
  const { 
    isConnected, 
    isConnecting, 
    isDisconnecting, 
    address, 
    chainId, 
    ensName, 
    balance, 
    connect, 
    disconnect, 
    switchChain,
    error: web3Error,
    clearError: clearWeb3Error 
  } = useWeb3();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showChainSelector, setShowChainSelector] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Markets', href: '/markets', icon: TrendingUp },
    { name: 'Oracle', href: '/oracle', icon: Cpu },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Chain options
  const chainOptions = [
    { id: 1, name: 'Ethereum', symbol: 'ETH' },
    { id: 137, name: 'Polygon', symbol: 'MATIC' },
    { id: 42161, name: 'Arbitrum', symbol: 'ETH' },
    { id: 11155111, name: 'Sepolia', symbol: 'ETH' },
  ];

  const getChainName = (chainId?: number) => {
    return chainOptions.find(chain => chain.id === chainId)?.name || 'Unknown';
  };

  const handleConnectWallet = useCallback(async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  }, [connect]);

  const handleDisconnectWallet = useCallback(async () => {
    try {
      await disconnect();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  }, [disconnect]);

  const handleSwitchChain = useCallback(async (targetChainId: number) => {
    try {
      await switchChain(targetChainId);
      setShowChainSelector(false);
    } catch (error) {
      console.error('Chain switch failed:', error);
    }
  }, [switchChain]);

  // Clear any errors
  const handleClearError = useCallback(() => {
    clearError();
    clearWeb3Error();
  }, [clearError, clearWeb3Error]);

  // Get current error (prioritize Web3 errors)
  const currentError = web3Error || error;

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative">
              <img 
                src="/assets/vpo-logo-simple.svg" 
                alt="VPO Logo" 
                className="w-8 h-8 mr-3"
              />
              <div className="absolute inset-0 w-8 h-8 mr-3 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse-soft"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900 font-inter">VPO</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover-lift ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 shadow-sm ring-1 ring-blue-200/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

              {/* Error Display */}
              {currentError && (
                <div className="flex items-center space-x-2 mr-4">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 font-inter">{currentError}</span>
                  <button
                    onClick={handleClearError}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                {/* Chain Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowChainSelector(!showChainSelector)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Network className="w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">
                      {getChainName(chainId)}
                    </span>
                  </button>
                  
                  {showChainSelector && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {chainOptions.map((chain) => (
                        <button
                          key={chain.id}
                          onClick={() => handleSwitchChain(chain.id)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                            chainId === chain.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{chain.name}</span>
                            <span className="text-xs text-gray-500">{chain.symbol}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="text-sm text-gray-600 font-inter">
                  {ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                </div>
                
                {/* Balance */}
                {balance && (
                  <div className="text-sm text-gray-500 font-inter">
                    {balance}
                  </div>
                )}

                {/* Avatar */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {address?.slice(2, 4).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 animate-pulse-soft"></div>
                </div>

                {/* Disconnect Button */}
                <button
                  onClick={handleDisconnectWallet}
                  disabled={isDisconnecting}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-inter disabled:opacity-50"
                >
                  {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover-lift shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      Connect Wallet
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse-soft"></div>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default memo(AppNavigation);
