import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Clock, Users, DollarSign, Tag, CheckCircle, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import AppNavigation from '../components/AppNavigation';
import { useMarkets, useMarketStats } from '../hooks/useMarkets';
import { MarketFilters, MarketSort, MarketCategory, MarketStatus } from '../types/market';

const Markets: React.FC = () => {
  const [filters, setFilters] = useState<MarketFilters>({});
  const [sort, setSort] = useState<MarketSort>({ field: 'volume', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: markets, isLoading: marketsLoading, error: marketsError } = useMarkets(filters, sort);
  const { data: stats, isLoading: statsLoading } = useMarketStats();

  const filteredMarkets = useMemo(() => {
    if (!markets) return [];
    
    if (!searchQuery) return markets;
    
    const query = searchQuery.toLowerCase();
    return markets.filter(market => 
      market.title.toLowerCase().includes(query) ||
      market.description.toLowerCase().includes(query) ||
      market.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [markets, searchQuery]);

  const handleFilterChange = useCallback((newFilters: Partial<MarketFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleSortChange = useCallback((field: MarketSort['field']) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

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

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const getStatusColor = (status: MarketStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      case 'RESOLVED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: MarketCategory) => {
    const colors = {
      POLITICS: 'bg-red-100 text-red-800',
      SPORTS: 'bg-orange-100 text-orange-800',
      CRYPTO: 'bg-yellow-100 text-yellow-800',
      TECHNOLOGY: 'bg-blue-100 text-blue-800',
      ECONOMICS: 'bg-green-100 text-green-800',
      WEATHER: 'bg-cyan-100 text-cyan-800',
      ENTERTAINMENT: 'bg-purple-100 text-purple-800',
      SCIENCE: 'bg-indigo-100 text-indigo-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.OTHER;
  };

  if (marketsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <AppNavigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 card-glow">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load markets</h2>
              <p className="text-gray-600">Please try refreshing the page.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <AppNavigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-inter">Prediction Markets</h1>
          <p className="text-gray-600 font-inter">Trade on the future with verifiable, AI-powered predictions</p>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 card-glow">
                <LoadingSpinner size="sm" variant="dots" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 card-glow hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-inter">Total Markets</p>
                  <p className="text-2xl font-bold text-gray-900 font-inter">{stats.totalMarkets}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 card-glow hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-inter">Total Volume</p>
                  <p className="text-2xl font-bold text-gray-900 font-inter">{formatCurrency(stats.totalVolume)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 card-glow hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-inter">Active Markets</p>
                  <p className="text-2xl font-bold text-gray-900 font-inter">{stats.activeMarkets}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 card-glow hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-inter">Resolved Today</p>
                  <p className="text-2xl font-bold text-gray-900 font-inter">{stats.resolvedToday}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8 card-glow">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white/50 border border-gray-200 rounded-xl hover:bg-white/70 transition-colors font-inter"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            {/* Sort */}
            <select
              value={`${sort.field}-${sort.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-') as [MarketSort['field'], 'asc' | 'desc'];
                setSort({ field, direction });
              }}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
            >
              <option value="volume-desc">Volume (High to Low)</option>
              <option value="volume-asc">Volume (Low to High)</option>
              <option value="liquidity-desc">Liquidity (High to Low)</option>
              <option value="liquidity-asc">Liquidity (Low to High)</option>
              <option value="endDate-asc">End Date (Soonest)</option>
              <option value="endDate-desc">End Date (Latest)</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange({ category: e.target.value as MarketCategory || undefined })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                  >
                    <option value="">All Categories</option>
                    <option value="POLITICS">Politics</option>
                    <option value="SPORTS">Sports</option>
                    <option value="CRYPTO">Crypto</option>
                    <option value="TECHNOLOGY">Technology</option>
                    <option value="ECONOMICS">Economics</option>
                    <option value="WEATHER">Weather</option>
                    <option value="ENTERTAINMENT">Entertainment</option>
                    <option value="SCIENCE">Science</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">Status</label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange({ status: e.target.value as MarketStatus || undefined })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                  >
                    <option value="">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                    <option value="CLOSED">Closed</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                {/* Verified Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">Verification</label>
                  <select
                    value={filters.verified === undefined ? '' : filters.verified.toString()}
                    onChange={(e) => handleFilterChange({ verified: e.target.value === '' ? undefined : e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                  >
                    <option value="">All Markets</option>
                    <option value="true">Verified Only</option>
                    <option value="false">Unverified Only</option>
                  </select>
                </div>

                {/* Volume Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">Min Volume</label>
                  <input
                    type="number"
                    placeholder="Min volume"
                    value={filters.minVolume || ''}
                    onChange={(e) => handleFilterChange({ minVolume: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Markets List */}
        {marketsLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" text="Loading prediction markets..." variant="crystal" showIcon={true} />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMarkets.map((market) => (
              <div key={market.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 card-glow hover-lift">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Market Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 font-inter">{market.title}</h3>
                          {market.isVerified && (
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <p className="text-gray-600 text-sm font-inter mb-3">{market.description}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(market.category)}`}>
                            {market.category}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(market.status)}`}>
                            {market.status}
                          </span>
                          {market.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Market Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 font-inter">Volume</p>
                        <p className="font-semibold text-gray-900 font-inter">{formatCurrency(market.volume)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-inter">Liquidity</p>
                        <p className="font-semibold text-gray-900 font-inter">{formatCurrency(market.liquidity)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-inter">Participants</p>
                        <p className="font-semibold text-gray-900 font-inter">{market.participants.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-inter">End Date</p>
                        <p className="font-semibold text-gray-900 font-inter">
                          {new Date(market.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="lg:w-64">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600 font-inter">Current Price</span>
                        <div className={`flex items-center gap-1 ${getPriceChangeColor(market.priceChangePercent24h)}`}>
                          {getPriceChangeIcon(market.priceChangePercent24h)}
                          <span className="text-sm font-medium">
                            {market.priceChangePercent24h > 0 ? '+' : ''}{market.priceChangePercent24h.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-2xl font-bold text-gray-900 mb-2 font-inter">
                        {formatPrice(market.lastPrice)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-center">
                          <p className="text-gray-500 font-inter">YES</p>
                          <p className="font-semibold text-green-600 font-inter">{formatPrice(market.yesPrice)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500 font-inter">NO</p>
                          <p className="font-semibold text-red-600 font-inter">{formatPrice(market.noPrice)}</p>
                        </div>
                      </div>
                      
                      <button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-inter">
                        Trade
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!marketsLoading && filteredMarkets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-inter">No markets found</h3>
            <p className="text-gray-600 font-inter">Try adjusting your search or filter criteria.</p>
        </div>
        )}
      </main>
    </div>
  );
};

export default Markets;
