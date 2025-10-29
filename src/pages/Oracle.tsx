import React, { useState, useEffect, useMemo } from 'react';
import { Cpu, Activity, CheckCircle, AlertTriangle, Clock, Database, Zap, Shield, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import AppNavigation from '../components/AppNavigation';

interface OracleStatus {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'MAINTENANCE';
  lastUpdate: string;
  confidence: number;
  uptime: number;
  dataSource: string;
  resolutionCount: number;
  avgResolutionTime: number;
  errorRate: number;
}

interface AIModel {
  id: string;
  name: string;
  version: string;
  status: 'ACTIVE' | 'TRAINING' | 'ERROR';
  accuracy: number;
  lastTraining: string;
  predictionsCount: number;
  confidence: number;
}

interface ResolutionHistory {
  id: string;
  marketId: string;
  marketTitle: string;
  outcome: 'YES' | 'NO' | 'INVALID';
  confidence: number;
  resolvedAt: string;
  resolutionMethod: 'AI' | 'MANUAL' | 'COMMUNITY';
  dataSource: string;
}

const Oracle: React.FC = () => {
  const [oracleStatuses, setOracleStatuses] = useState<OracleStatus[]>([]);
  const [aiModels, setAiModels] = useState<AIModel[]>([]);
  const [resolutionHistory, setResolutionHistory] = useState<ResolutionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock oracle statuses
      setOracleStatuses([
        {
          id: '1',
          name: 'Chainlink Price Feeds',
          status: 'ACTIVE',
          lastUpdate: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          confidence: 0.98,
          uptime: 99.9,
          dataSource: 'Chainlink',
          resolutionCount: 1250,
          avgResolutionTime: 2.5,
          errorRate: 0.1
        },
        {
          id: '2',
          name: 'UMA Optimistic Oracle',
          status: 'ACTIVE',
          lastUpdate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          confidence: 0.95,
          uptime: 99.5,
          dataSource: 'UMA',
          resolutionCount: 890,
          avgResolutionTime: 4.2,
          errorRate: 0.3
        },
        {
          id: '3',
          name: 'VPO AI Oracle',
          status: 'ACTIVE',
          lastUpdate: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
          confidence: 0.92,
          uptime: 98.8,
          dataSource: 'VPO-AI',
          resolutionCount: 2100,
          avgResolutionTime: 1.8,
          errorRate: 0.5
        },
        {
          id: '4',
          name: 'Weather Oracle',
          status: 'MAINTENANCE',
          lastUpdate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          confidence: 0.88,
          uptime: 97.2,
          dataSource: 'OpenWeather',
          resolutionCount: 450,
          avgResolutionTime: 3.1,
          errorRate: 1.2
        }
      ]);

      // Mock AI models
      setAiModels([
        {
          id: '1',
          name: 'GPT-4 Vision',
          version: '4.0',
          status: 'ACTIVE',
          accuracy: 0.94,
          lastTraining: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          predictionsCount: 15420,
          confidence: 0.92
        },
        {
          id: '2',
          name: 'Claude-3 Opus',
          version: '3.0',
          status: 'ACTIVE',
          accuracy: 0.91,
          lastTraining: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          predictionsCount: 12300,
          confidence: 0.89
        },
        {
          id: '3',
          name: 'Custom VPO Model',
          version: '2.1',
          status: 'TRAINING',
          accuracy: 0.87,
          lastTraining: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          predictionsCount: 8900,
          confidence: 0.85
        }
      ]);

      // Mock resolution history
      setResolutionHistory([
        {
          id: '1',
          marketId: '5',
          marketTitle: 'Will the 2024 Olympics have over 10,000 athletes?',
          outcome: 'YES',
          confidence: 0.98,
          resolvedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          resolutionMethod: 'AI',
          dataSource: 'VPO-AI'
        },
        {
          id: '2',
          marketId: '6',
          marketTitle: 'Will Bitcoin reach $50,000 by Q1 2024?',
          outcome: 'NO',
          confidence: 0.95,
          resolvedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          resolutionMethod: 'AI',
          dataSource: 'Chainlink'
        },
        {
          id: '3',
          marketId: '7',
          marketTitle: 'Will there be a major earthquake in California in 2024?',
          outcome: 'NO',
          confidence: 0.92,
          resolvedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          resolutionMethod: 'AI',
          dataSource: 'UMA'
        }
      ]);

      setIsLoading(false);
      setLastUpdate(new Date());
    };

    loadData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100';
      case 'INACTIVE': return 'text-gray-600 bg-gray-100';
      case 'ERROR': return 'text-red-600 bg-red-100';
      case 'MAINTENANCE': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="w-4 h-4" />;
      case 'INACTIVE': return <Clock className="w-4 h-4" />;
      case 'ERROR': return <AlertTriangle className="w-4 h-4" />;
      case 'MAINTENANCE': return <RefreshCw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const overallHealth = useMemo(() => {
    const activeOracles = oracleStatuses.filter(o => o.status === 'ACTIVE').length;
    const totalOracles = oracleStatuses.length;
    const avgConfidence = oracleStatuses.reduce((sum, o) => sum + o.confidence, 0) / totalOracles;
    const avgUptime = oracleStatuses.reduce((sum, o) => sum + o.uptime, 0) / totalOracles;
    
    return {
      activeOracles,
      totalOracles,
      avgConfidence,
      avgUptime,
      healthScore: (activeOracles / totalOracles) * avgConfidence * avgUptime / 100
    };
  }, [oracleStatuses]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <AppNavigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" text="Loading oracle services..." variant="crystal" showIcon={true} />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-inter">Oracle Network</h1>
          <p className="text-gray-600 font-inter">Real-time monitoring of AI-powered prediction resolution systems</p>
          <div className="flex items-center gap-2 mt-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-500 font-inter">Last updated: {formatTimeAgo(lastUpdate.toISOString())}</span>
          </div>
        </div>

        {/* Overall Health */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 card-glow hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-inter">System Health</p>
                <p className="text-2xl font-bold text-gray-900 font-inter">{(overallHealth.healthScore * 100).toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 card-glow hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-inter">Active Oracles</p>
                <p className="text-2xl font-bold text-gray-900 font-inter">{overallHealth.activeOracles}/{overallHealth.totalOracles}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 card-glow hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-inter">Avg Confidence</p>
                <p className="text-2xl font-bold text-gray-900 font-inter">{(overallHealth.avgConfidence * 100).toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 card-glow hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-inter">Avg Uptime</p>
                <p className="text-2xl font-bold text-gray-900 font-inter">{overallHealth.avgUptime.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Oracle Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 card-glow">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-inter">Oracle Status</h2>
            <div className="space-y-4">
              {oracleStatuses.map((oracle) => (
                <div key={oracle.id} className="p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900 font-inter">{oracle.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(oracle.status)}`}>
                        {getStatusIcon(oracle.status)}
                        {oracle.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 font-inter">{formatTimeAgo(oracle.lastUpdate)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 font-inter">Confidence</p>
                      <p className="font-semibold text-gray-900 font-inter">{(oracle.confidence * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-inter">Uptime</p>
                      <p className="font-semibold text-gray-900 font-inter">{oracle.uptime.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-inter">Resolutions</p>
                      <p className="font-semibold text-gray-900 font-inter">{oracle.resolutionCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-inter">Avg Time</p>
                      <p className="font-semibold text-gray-900 font-inter">{oracle.avgResolutionTime.toFixed(1)}s</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Models */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 card-glow">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-inter">AI Models</h2>
            <div className="space-y-4">
              {aiModels.map((model) => (
                <div key={model.id} className="p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900 font-inter">{model.name}</h3>
                      <span className="text-xs text-gray-500 font-inter">v{model.version}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                        {getStatusIcon(model.status)}
                        {model.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 font-inter">{formatTimeAgo(model.lastTraining)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 font-inter">Accuracy</p>
                      <p className="font-semibold text-gray-900 font-inter">{(model.accuracy * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-inter">Predictions</p>
                      <p className="font-semibold text-gray-900 font-inter">{model.predictionsCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-inter">Confidence</p>
                      <p className="font-semibold text-gray-900 font-inter">{(model.confidence * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-inter">Last Training</p>
                      <p className="font-semibold text-gray-900 font-inter">{formatTimeAgo(model.lastTraining)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Resolutions */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 card-glow">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-inter">Recent Resolutions</h2>
          <div className="space-y-4">
            {resolutionHistory.map((resolution) => (
              <div key={resolution.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 font-inter">{resolution.marketTitle}</h3>
                  <p className="text-sm text-gray-600 font-inter">{resolution.dataSource} • {formatTimeAgo(resolution.resolvedAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-semibold ${resolution.outcome === 'YES' ? 'text-green-600' : resolution.outcome === 'NO' ? 'text-red-600' : 'text-gray-600'} font-inter`}>
                      {resolution.outcome}
                    </p>
                    <p className="text-sm text-gray-500 font-inter">{(resolution.confidence * 100).toFixed(1)}% confidence</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${resolution.outcome === 'YES' ? 'bg-green-500' : resolution.outcome === 'NO' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Oracle;
