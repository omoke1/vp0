import React, { memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { BarChart3, TrendingUp, Cpu, Menu, X, Wallet, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const AppNavigation: React.FC = () => {
  const { user, disconnectWallet, connectWallet, isWalletConnecting, error, clearError } = useAppStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Markets', href: '/markets', icon: TrendingUp },
    { name: 'Oracle', href: '/oracle', icon: Cpu },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleConnectWallet = useCallback(async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  }, [connectWallet]);

  const handleDisconnectWallet = useCallback(() => {
    disconnectWallet();
    setIsMobileMenuOpen(false);
  }, [disconnectWallet]);

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
          {error && (
            <div className="flex items-center space-x-2 mr-4">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 font-inter">{error}</span>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600 font-inter">
                  {user.ensName || `${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
                </div>
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.address.slice(2, 4).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 animate-pulse-soft"></div>
                </div>
                <button
                  onClick={handleDisconnectWallet}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-inter"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                onClick={handleConnectWallet}
                disabled={isWalletConnecting}
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover-lift shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isWalletConnecting ? (
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
