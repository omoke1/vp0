import React, { useState } from 'react';
import { Play, Pause, ExternalLink, TrendingUp, Shield, Zap, Globe, ChevronRight, ArrowRight, Sparkles, Layers, Network, Target } from 'lucide-react';

const EcosystemSection: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const ecosystemPartners = [
    {
      name: "Kalshi",
      description: "CFTC-regulated prediction markets leader",
      status: "Market Leader 2025",
      volume: "$1.43B+",
      color: "from-blue-500 to-cyan-500",
      icon: <Target className="w-6 h-6" />,
      gradient: "from-blue-500 via-cyan-500 to-teal-500"
    },
    {
      name: "Polymarket",
      description: "Decentralized prediction markets",
      status: "X Integration",
      volume: "$1.43B+",
      color: "from-purple-500 to-pink-500",
      icon: <Network className="w-6 h-6" />,
      gradient: "from-purple-500 via-pink-500 to-rose-500"
    },
    {
      name: "Chainlink",
      description: "Decentralized oracle network",
      status: "Oracle Provider",
      volume: "1000+ Feeds",
      color: "from-orange-500 to-red-500",
      icon: <Layers className="w-6 h-6" />,
      gradient: "from-orange-500 via-red-500 to-pink-500"
    },
    {
      name: "PredictBase",
      description: "Base network prediction markets",
      status: "Emerging",
      volume: "USDC Native",
      color: "from-green-500 to-emerald-500",
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: "from-green-500 via-emerald-500 to-cyan-500"
    }
  ];

  const ecosystemFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trustless Verification",
      description: "Cryptographically secure truth verification without intermediaries"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Resolution",
      description: "Real-time market resolution with automated settlement"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Access",
      description: "Borderless prediction markets accessible worldwide"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "AI-Enhanced",
      description: "Machine learning powered insights and market analysis"
    }
  ];

  return (
    <section id="ecosystem" className="relative overflow-hidden">
      {/* Hero Section with Video */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-500"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Ecosystem 2025</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8">
              The Future of <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Prediction Markets
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              VPO powers the next generation of decentralized prediction markets, 
              integrating with leading platforms and cutting-edge technology to deliver 
              <span className="text-blue-400 font-semibold"> verifiable truth</span> at scale.
            </p>
          </div>

          {/* Video Section */}
          <div className="relative max-w-5xl mx-auto mb-20">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 z-10"></div>
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/8aGhZQkoFbQ?autoplay=1&mute=1&loop=1&playlist=8aGhZQkoFbQ&start=0&end=240&controls=0&showinfo=0&rel=0"
                title="Blockchain Oracle Explained"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="relative z-0"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
                  <span className="text-white">Chainlink: The Oracle Problem Explained</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="relative bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Ecosystem Partners
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by the industry's leading platforms and innovators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ecosystemPartners.map((partner, index) => (
              <div
                key={partner.name}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${partner.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 bg-gradient-to-br ${partner.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {partner.icon}
                </div>

                {/* Content */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {partner.name}
                    </h4>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {partner.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {partner.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {partner.volume}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Choose VPO?
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for the future of verifiable predictions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ecosystemFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="group text-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    {feature.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;