import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useMarkets, useMarketStats, useUserPortfolio } from '../hooks/useMarkets';
import LoadingSpinner from '../components/LoadingSpinner';
import AppNavigation from '../components/AppNavigation';
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, Target, BarChart3, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAppStore();
  
  // Fetch data
  const { data: markets, isLoading: marketsLoading } = useMarkets({ status: 'ACTIVE' }, { field: 'volume', direction: 'desc' });
  const { data: stats, isLoading: statsLoading } = useMarketStats();
  const { data: portfolio, isLoading: portfolioLoading } = useUserPortfolio();

  // Get top markets for quick access
  const topMarkets = useMemo(() => {
    return markets?.slice(0, 5) || [];
  }, [markets]);

  // Calculate portfolio performance
  const portfolioPerformance = useMemo(() => {
    if (!portfolio) return { totalPnl: 0, pnlPercent: 0, isPositive: true };
    
    const totalPnl = portfolio.totalPayout - portfolio.totalInvested;
    const pnlPercent = portfolio.totalInvested > 0 ? (totalPnl / portfolio.totalInvested) * 100 : 0;
    
    return {
      totalPnl,
      pnlPercent,
      isPositive: totalPnl >= 0
    };
  }, [portfolio]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPrice = (price: number) => {
    return (price * 100).toFixed(1) + '%';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Initializing Veyra Dashboard..." variant="crystal" showIcon={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <AppNavigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-inter">
            Welcome back, {user?.ensName || 'Trader'}
          </h1>
          <p className="text-gray-600 font-inter">
            Your gateway to verifiable prediction markets powered by AI and cryptographic proofs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portfolio Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 card-glow mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-inter">Portfolio Overview</h2>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600 font-inter">Live</span>
                </div>
              </div>
              
              {portfolioLoading ? (
                <div className="flex items-center justify-center h-32">
                  <LoadingSpinner size="md" variant="dots" />
                </div>
              ) : portfolio ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200/50 hover-lift">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-10 translate-x-10"></div>
                    <h3 className="font-semibold text-blue-900 mb-2 font-inter">Total Value</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-1 font-inter">{formatCurrency(portfolio.totalValue)}</p>
                    <p className="text-sm text-blue-700 font-inter">Current portfolio</p>
                  </div>
                  
                  <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200/50 hover-lift">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full -translate-y-10 translate-x-10"></div>
                    <h3 className="font-semibold text-green-900 mb-2 font-inter">P&L</h3>
                    <div className="flex items-center gap-2">
                      {portfolioPerformance.isPositive ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                      <p className={`text-3xl font-bold ${portfolioPerformance.isPositive ? 'text-green-600' : 'text-red-600'} font-inter`}>
                        {formatCurrency(portfolioPerformance.totalPnl)}
                      </p>
                    </div>
                    <p className={`text-sm ${portfolioPerformance.isPositive ? 'text-green-700' : 'text-red-700'} font-inter`}>
                      {portfolioPerformance.pnlPercent > 0 ? '+' : ''}{portfolioPerformance.pnlPercent.toFixed(1)}%
                    </p>
                  </div>
                  
                  <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border border-purple-200/50 hover-lift">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full -translate-y-10 translate-x-10"></div>
                    <h3 className="font-semibold text-purple-900 mb-2 font-inter">Active Positions</h3>
                    <p className="text-3xl font-bold text-purple-600 mb-1 font-inter">{portfolio.activePositions}</p>
                    <p className="text-sm text-purple-700 font-inter">Open trades</p>
                  </div>
                  
                  <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border border-orange-200/50 hover-lift">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 rounded-full -translate-y-10 translate-x-10"></div>
                    <h3 className="font-semibold text-orange-900 mb-2 font-inter">Win Rate</h3>
                    <p className="text-3xl font-bold text-orange-600 mb-1 font-inter">{(portfolio.winRate * 100).toFixed(0)}%</p>
                    <p className="text-sm text-orange-700 font-inter">Success rate</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-inter">No Portfolio Data</h3>
                  <p className="text-gray-600 font-inter">Connect your wallet to view your portfolio.</p>
                </div>
              )}
            </div>

            {/* Top Markets */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 card-glow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-inter">Top Markets</h2>
                <button className="text-blue-600 hover:text-blue-700 font-inter">View All</button>
              </div>
              
              {marketsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <LoadingSpinner size="md" variant="dots" />
                </div>
              ) : (
                <div className="space-y-4">
                  {topMarkets.map((market) => (
                    <div key={market.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 font-inter">{market.title}</h3>
                        <p className="text-sm text-gray-600 font-inter">{market.category} • {market.participants.toLocaleString()} participants</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 font-inter">{formatPrice(market.lastPrice)}</p>
                          <p className="text-sm text-gray-600 font-inter">Volume: {formatCurrency(market.volume)}</p>
                        </div>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-inter">
                          Trade
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 card-glow">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-inter">Market Stats</h3>
              
              {statsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <LoadingSpinner size="sm" variant="dots" />
                </div>
              ) : stats ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/50 border border-blue-200/50">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600 font-inter">Total Markets</span>
                    </div>
                    <span className="text-sm font-medium text-blue-600 font-inter">{stats.totalMarkets}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50/50 border border-green-200/50">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600 font-inter">Total Volume</span>
                    </div>
                    <span className="text-sm font-medium text-green-600 font-inter">{formatCurrency(stats.totalVolume)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50/50 border border-purple-200/50">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600 font-inter">Active Markets</span>
                    </div>
                    <span className="text-sm font-medium text-purple-600 font-inter">{stats.activeMarkets}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50/50 border border-orange-200/50">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-gray-600 font-inter">Resolved Today</span>
                    </div>
                    <span className="text-sm font-medium text-orange-600 font-inter">{stats.resolvedToday}</span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 card-glow">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-inter">Quick Actions</h3>
              <div className="space-y-4">
                <button className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover-lift shadow-lg font-inter">
                  <span className="relative z-10 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Browse Markets
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse-soft"></div>
                </button>
                <button className="w-full bg-white/50 text-gray-700 py-3 px-6 rounded-xl hover:bg-white/70 transition-all duration-300 hover-lift border border-gray-200/50 font-inter flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Create Prediction
                </button>
                <button className="w-full bg-white/50 text-gray-700 py-3 px-6 rounded-xl hover:bg-white/70 transition-all duration-300 hover-lift border border-gray-200/50 font-inter flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  View Oracle Status
                </button>
              </div>
            </div>

            {/* Oracle Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 card-glow">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-inter">Oracle Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50/50 border border-green-200/50">
                  <span className="text-sm text-gray-600 font-inter">Network Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
                    <span className="text-sm font-medium text-green-600 font-inter">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/50 border border-blue-200/50">
                  <span className="text-sm text-gray-600 font-inter">AI Models</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-soft"></div>
                    <span className="text-sm font-medium text-blue-600 font-inter">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 border border-gray-200/50">
                  <span className="text-sm text-gray-600 font-inter">Last Resolution</span>
                  <span className="text-sm font-medium text-gray-900 font-inter">2 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
