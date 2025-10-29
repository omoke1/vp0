export interface PredictionMarket {
  id: string;
  title: string;
  description: string;
  category: MarketCategory;
  status: MarketStatus;
  endDate: string;
  resolutionDate?: string;
  volume: number;
  liquidity: number;
  participants: number;
  yesPrice: number;
  noPrice: number;
  lastPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  tags: string[];
  creator: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  isVerified: boolean;
  isResolved: boolean;
  resolution?: MarketResolution;
  oracleData?: OracleData;
}

export interface MarketResolution {
  outcome: 'YES' | 'NO' | 'INVALID';
  confidence: number;
  resolutionMethod: 'AI' | 'MANUAL' | 'COMMUNITY';
  resolvedAt: string;
  resolutionData: any;
}

export interface OracleData {
  oracleId: string;
  dataSource: string;
  lastUpdate: string;
  confidence: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  metadata: Record<string, any>;
}

export type MarketCategory = 
  | 'POLITICS'
  | 'SPORTS'
  | 'CRYPTO'
  | 'TECHNOLOGY'
  | 'ECONOMICS'
  | 'WEATHER'
  | 'ENTERTAINMENT'
  | 'SCIENCE'
  | 'OTHER';

export type MarketStatus = 
  | 'ACTIVE'
  | 'PAUSED'
  | 'CLOSED'
  | 'RESOLVED'
  | 'CANCELLED';

export interface MarketFilters {
  category?: MarketCategory;
  status?: MarketStatus;
  minVolume?: number;
  maxVolume?: number;
  minLiquidity?: number;
  maxLiquidity?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  verified?: boolean;
  searchQuery?: string;
}

export interface MarketSort {
  field: 'volume' | 'liquidity' | 'participants' | 'endDate' | 'createdAt' | 'lastPrice';
  direction: 'asc' | 'desc';
}

export interface MarketStats {
  totalMarkets: number;
  totalVolume: number;
  totalLiquidity: number;
  activeMarkets: number;
  resolvedToday: number;
  averageResolutionTime: number;
  topCategories: Array<{
    category: MarketCategory;
    count: number;
    volume: number;
  }>;
}

export interface UserPortfolio {
  totalValue: number;
  totalInvested: number;
  totalPayout: number;
  activePositions: number;
  resolvedPositions: number;
  winRate: number;
  positions: UserPosition[];
}

export interface UserPosition {
  marketId: string;
  marketTitle: string;
  side: 'YES' | 'NO';
  amount: number;
  averagePrice: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  status: 'ACTIVE' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
}
