import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PredictionMarket, MarketFilters, MarketSort, MarketStats, UserPortfolio } from '../types/market';

// Mock API functions - will be replaced with real API calls
const mockMarkets: PredictionMarket[] = [
  {
    id: '1',
    title: 'Will Bitcoin reach $100,000 by end of 2024?',
    description: 'Prediction on Bitcoin price reaching $100,000 USD by December 31, 2024',
    category: 'CRYPTO',
    status: 'ACTIVE',
    endDate: '2024-12-31T23:59:59Z',
    volume: 2500000,
    liquidity: 1800000,
    participants: 15420,
    yesPrice: 0.65,
    noPrice: 0.35,
    lastPrice: 0.65,
    priceChange24h: 0.05,
    priceChangePercent24h: 8.33,
    tags: ['bitcoin', 'crypto', 'price', '2024'],
    creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:22:00Z',
    imageUrl: '/api/placeholder/400/200',
    isVerified: true,
    isResolved: false,
    oracleData: {
      oracleId: 'oracle-1',
      dataSource: 'Chainlink',
      lastUpdate: '2024-01-20T14:22:00Z',
      confidence: 0.95,
      status: 'ACTIVE',
      metadata: { source: 'coinbase', symbol: 'BTC-USD' }
    }
  },
  {
    id: '2',
    title: 'Will the US Federal Reserve cut rates in Q2 2024?',
    description: 'Prediction on Federal Reserve interest rate cuts in Q2 2024',
    category: 'ECONOMICS',
    status: 'ACTIVE',
    endDate: '2024-06-30T23:59:59Z',
    volume: 1800000,
    liquidity: 1200000,
    participants: 8930,
    yesPrice: 0.42,
    noPrice: 0.58,
    lastPrice: 0.42,
    priceChange24h: -0.03,
    priceChangePercent24h: -6.67,
    tags: ['federal-reserve', 'interest-rates', 'economics', 'q2-2024'],
    creator: '0x8ba1f109551bD432803012645Hac136c',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-20T11:45:00Z',
    isVerified: true,
    isResolved: false,
    oracleData: {
      oracleId: 'oracle-2',
      dataSource: 'UMA',
      lastUpdate: '2024-01-20T11:45:00Z',
      confidence: 0.88,
      status: 'ACTIVE',
      metadata: { source: 'federal-reserve-api', indicator: 'fed-funds-rate' }
    }
  },
  {
    id: '3',
    title: 'Will Tesla stock reach $300 by March 2024?',
    description: 'Prediction on Tesla stock price reaching $300 by March 31, 2024',
    category: 'TECHNOLOGY',
    status: 'ACTIVE',
    endDate: '2024-03-31T23:59:59Z',
    volume: 3200000,
    liquidity: 2400000,
    participants: 22150,
    yesPrice: 0.72,
    noPrice: 0.28,
    lastPrice: 0.72,
    priceChange24h: 0.08,
    priceChangePercent24h: 12.5,
    tags: ['tesla', 'stock', 'elon-musk', 'automotive'],
    creator: '0x1234567890123456789012345678901234567890',
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
    imageUrl: '/api/placeholder/400/200',
    isVerified: true,
    isResolved: false,
    oracleData: {
      oracleId: 'oracle-3',
      dataSource: 'Chainlink',
      lastUpdate: '2024-01-20T16:30:00Z',
      confidence: 0.92,
      status: 'ACTIVE',
      metadata: { source: 'yahoo-finance', symbol: 'TSLA' }
    }
  },
  {
    id: '4',
    title: 'Will there be a major AI breakthrough in 2024?',
    description: 'Prediction on significant AI advancement or breakthrough in 2024',
    category: 'TECHNOLOGY',
    status: 'ACTIVE',
    endDate: '2024-12-31T23:59:59Z',
    volume: 1500000,
    liquidity: 900000,
    participants: 12500,
    yesPrice: 0.78,
    noPrice: 0.22,
    lastPrice: 0.78,
    priceChange24h: 0.02,
    priceChangePercent24h: 2.63,
    tags: ['ai', 'artificial-intelligence', 'breakthrough', 'technology'],
    creator: '0xabcdef1234567890abcdef1234567890abcdef12',
    createdAt: '2024-01-12T08:45:00Z',
    updatedAt: '2024-01-20T13:15:00Z',
    isVerified: false,
    isResolved: false,
    oracleData: {
      oracleId: 'oracle-4',
      dataSource: 'VPO-AI',
      lastUpdate: '2024-01-20T13:15:00Z',
      confidence: 0.85,
      status: 'ACTIVE',
      metadata: { source: 'vpo-ai-models', model: 'gpt-4-vision' }
    }
  },
  {
    id: '5',
    title: 'Will the 2024 Olympics have over 10,000 athletes?',
    description: 'Prediction on total athlete count at 2024 Summer Olympics',
    category: 'SPORTS',
    status: 'RESOLVED',
    endDate: '2024-08-11T23:59:59Z',
    resolutionDate: '2024-08-12T10:30:00Z',
    volume: 800000,
    liquidity: 0,
    participants: 5600,
    yesPrice: 0.0,
    noPrice: 0.0,
    lastPrice: 0.0,
    priceChange24h: 0,
    priceChangePercent24h: 0,
    tags: ['olympics', 'sports', 'athletes', '2024'],
    creator: '0x9876543210987654321098765432109876543210',
    createdAt: '2024-01-08T12:00:00Z',
    updatedAt: '2024-08-12T10:30:00Z',
    isVerified: true,
    isResolved: true,
    resolution: {
      outcome: 'YES',
      confidence: 0.98,
      resolutionMethod: 'AI',
      resolvedAt: '2024-08-12T10:30:00Z',
      resolutionData: { athleteCount: 10824, source: 'olympic.org' }
    },
    oracleData: {
      oracleId: 'oracle-5',
      dataSource: 'VPO-AI',
      lastUpdate: '2024-08-12T10:30:00Z',
      confidence: 0.98,
      status: 'ACTIVE',
      metadata: { source: 'olympic-official', verified: true }
    }
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
const fetchMarkets = async (filters: MarketFilters = {}, sort: MarketSort = { field: 'volume', direction: 'desc' }): Promise<PredictionMarket[]> => {
  await delay(800); // Simulate network delay
  
  let filteredMarkets = [...mockMarkets];
  
  // Apply filters
  if (filters.category) {
    filteredMarkets = filteredMarkets.filter(market => market.category === filters.category);
  }
  
  if (filters.status) {
    filteredMarkets = filteredMarkets.filter(market => market.status === filters.status);
  }
  
  if (filters.minVolume) {
    filteredMarkets = filteredMarkets.filter(market => market.volume >= filters.minVolume!);
  }
  
  if (filters.maxVolume) {
    filteredMarkets = filteredMarkets.filter(market => market.volume <= filters.maxVolume!);
  }
  
  if (filters.verified !== undefined) {
    filteredMarkets = filteredMarkets.filter(market => market.isVerified === filters.verified);
  }
  
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredMarkets = filteredMarkets.filter(market => 
      market.title.toLowerCase().includes(query) ||
      market.description.toLowerCase().includes(query) ||
      market.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // Apply sorting
  filteredMarkets.sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sort.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sort.direction === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });
  
  return filteredMarkets;
};

const fetchMarketStats = async (): Promise<MarketStats> => {
  await delay(500);
  
  const activeMarkets = mockMarkets.filter(m => m.status === 'ACTIVE');
  const resolvedToday = mockMarkets.filter(m => 
    m.isResolved && 
    new Date(m.resolutionDate!).toDateString() === new Date().toDateString()
  );
  
  const categoryStats = mockMarkets.reduce((acc, market) => {
    const existing = acc.find(c => c.category === market.category);
    if (existing) {
      existing.count++;
      existing.volume += market.volume;
    } else {
      acc.push({
        category: market.category,
        count: 1,
        volume: market.volume
      });
    }
    return acc;
  }, [] as Array<{ category: MarketCategory; count: number; volume: number }>);
  
  return {
    totalMarkets: mockMarkets.length,
    totalVolume: mockMarkets.reduce((sum, m) => sum + m.volume, 0),
    totalLiquidity: mockMarkets.reduce((sum, m) => sum + m.liquidity, 0),
    activeMarkets: activeMarkets.length,
    resolvedToday: resolvedToday.length,
    averageResolutionTime: 7.2, // days
    topCategories: categoryStats.sort((a, b) => b.volume - a.volume).slice(0, 5)
  };
};

const fetchUserPortfolio = async (): Promise<UserPortfolio> => {
  await delay(600);
  
  // Mock portfolio data
  return {
    totalValue: 125000,
    totalInvested: 100000,
    totalPayout: 25000,
    activePositions: 8,
    resolvedPositions: 12,
    winRate: 0.75,
    positions: [
      {
        marketId: '1',
        marketTitle: 'Will Bitcoin reach $100,000 by end of 2024?',
        side: 'YES',
        amount: 1000,
        averagePrice: 0.60,
        currentValue: 650,
        pnl: 50,
        pnlPercent: 8.33,
        status: 'ACTIVE',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:22:00Z'
      },
      {
        marketId: '3',
        marketTitle: 'Will Tesla stock reach $300 by March 2024?',
        side: 'YES',
        amount: 2000,
        averagePrice: 0.65,
        currentValue: 1440,
        pnl: 140,
        pnlPercent: 10.77,
        status: 'ACTIVE',
        createdAt: '2024-01-10T14:20:00Z',
        updatedAt: '2024-01-20T16:30:00Z'
      }
    ]
  };
};

// React Query hooks
export const useMarkets = (filters: MarketFilters = {}, sort: MarketSort = { field: 'volume', direction: 'desc' }) => {
  return useQuery({
    queryKey: ['markets', filters, sort],
    queryFn: () => fetchMarkets(filters, sort),
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
  });
};

export const useMarketStats = () => {
  return useQuery({
    queryKey: ['market-stats'],
    queryFn: fetchMarketStats,
    staleTime: 60000, // 1 minute
    cacheTime: 600000, // 10 minutes
  });
};

export const useUserPortfolio = () => {
  return useQuery({
    queryKey: ['user-portfolio'],
    queryFn: fetchUserPortfolio,
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
  });
};

export const useMarket = (marketId: string) => {
  return useQuery({
    queryKey: ['market', marketId],
    queryFn: async () => {
      await delay(400);
      const market = mockMarkets.find(m => m.id === marketId);
      if (!market) throw new Error('Market not found');
      return market;
    },
    enabled: !!marketId,
    staleTime: 10000, // 10 seconds
  });
};

// Mutation hooks
export const useCreateMarket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (marketData: Partial<PredictionMarket>) => {
      await delay(1000);
      // In real implementation, this would create a new market
      console.log('Creating market:', marketData);
      return { id: Date.now().toString(), ...marketData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['market-stats'] });
    },
  });
};

export const usePlaceBet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ marketId, side, amount }: { marketId: string; side: 'YES' | 'NO'; amount: number }) => {
      await delay(800);
      // In real implementation, this would place a bet
      console.log('Placing bet:', { marketId, side, amount });
      return { success: true, transactionHash: '0x...' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['markets'] });
    },
  });
};
