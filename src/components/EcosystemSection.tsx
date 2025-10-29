import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ExternalLink, TrendingUp, Shield, Zap, Globe, ChevronRight, ArrowRight, Sparkles, Layers, Network, Target, Brain, Lock, Rocket, Users, BarChart3, Cpu, Database, CheckCircle, Volume2, VolumeX } from 'lucide-react';

const EcosystemSection: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const togglePlayPause = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const newSrc = isVideoPlaying 
        ? iframe.src.replace('autoplay=1', 'autoplay=0')
        : iframe.src.replace('autoplay=0', 'autoplay=1');
      iframe.src = newSrc;
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleMute = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const newSrc = isMuted 
        ? iframe.src.replace('mute=1', 'mute=0')
        : iframe.src.replace('mute=0', 'mute=1');
      iframe.src = newSrc;
      setIsMuted(!isMuted);
    }
  };

  const openInNewTab = () => {
    window.open('https://www.youtube.com/watch?v=8aGhZQkoFbQ', '_blank', 'noopener,noreferrer');
  };

  const ecosystemPartners = [
    {
      name: "Kalshi",
      description: "CFTC-regulated prediction markets leader",
      status: "Market Leader 2025",
      volume: "$1.43B+",
      color: "from-blue-500 to-cyan-500",
      logo: "/assets/kalshi-logo.svg",
      gradient: "from-blue-500 via-cyan-500 to-teal-500"
    },
    {
      name: "Polymarket",
      description: "Decentralized prediction markets",
      status: "X Integration",
      volume: "$1.43B+",
      color: "from-purple-500 to-pink-500",
      logo: "/assets/polymarket-logo.svg",
      gradient: "from-purple-500 via-pink-500 to-rose-500"
    },
    {
      name: "Chainlink",
      description: "Decentralized oracle network",
      status: "Oracle Provider",
      volume: "1000+ Feeds",
      color: "from-orange-500 to-red-500",
      logo: "/assets/chainlink-logo.svg",
      gradient: "from-orange-500 via-red-500 to-pink-500"
    },
    {
      name: "PredictBase",
      description: "Base network prediction markets",
      status: "Emerging",
      volume: "USDC Native",
      color: "from-green-500 to-emerald-500",
      logo: "/assets/predictbase-logo.svg",
      gradient: "from-green-500 via-emerald-500 to-cyan-500"
    }
  ];

  const ecosystemFeatures = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Cryptographic Security",
      description: "Military-grade encryption ensures every prediction is tamper-proof and verifiable",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      accent: "bg-blue-500"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Sub-second resolution times powered by cutting-edge blockchain technology",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      accent: "bg-purple-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms provide unprecedented market insights",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      accent: "bg-orange-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Global Community",
      description: "Join millions of users worldwide in the future of decentralized predictions",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      accent: "bg-green-500"
    }
  ];

  return (
    <section id="ecosystem" className="relative overflow-hidden bg-white">
      {/* Hero Section with Video */}
      <div className="relative py-24 sm:py-32 flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-500"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm ring-1 ring-black/5 text-sm font-medium text-gray-700 mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Ecosystem 2025</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8 text-gray-900">
              The Future of <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Prediction Markets
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              VPO powers the next generation of decentralized prediction markets, 
              integrating with leading platforms and cutting-edge technology to deliver 
              <span className="text-blue-600 font-semibold"> verifiable truth</span> at scale.
            </p>
          </div>

          {/* Video Section */}
          <div className="relative max-w-5xl mx-auto mb-20">
            <div 
              className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 group"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <iframe
                ref={iframeRef}
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/8aGhZQkoFbQ?autoplay=1&mute=1&loop=1&playlist=8aGhZQkoFbQ&start=0&end=240&controls=0&showinfo=0&rel=0"
                title="Blockchain Oracle Explained"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="relative z-0"
              />
              
              {/* Video Title Overlay */}
              <div className="absolute bottom-6 left-6 z-20">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
                  <span className="text-white">Chainlink: The Oracle Problem Explained</span>
                </div>
              </div>

              {/* Custom Video Controls */}
              <div className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center space-x-4">
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlayPause}
                    className="flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 group"
                    aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" />
                    )}
                  </button>

                  {/* Mute/Unmute Button */}
                  <button
                    onClick={toggleMute}
                    className="flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 group"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-6 h-6 text-white" />
                    ) : (
                      <Volume2 className="w-6 h-6 text-white" />
                    )}
                  </button>

                  {/* Open in New Tab Button */}
                  <button
                    onClick={openInNewTab}
                    className="flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 group"
                    aria-label="Open video in new tab"
                  >
                    <ExternalLink className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Video Status Indicator */}
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
                  <span className="text-white flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isVideoPlaying ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span>{isVideoPlaying ? 'Playing' : 'Paused'}</span>
                  </span>
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
                
                {/* Logo */}
                <div className="relative w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logo`}
                    className="w-full h-full object-contain"
                  />
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
      <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm ring-1 ring-black/5 text-sm font-medium text-gray-700 mb-6">
              <CheckCircle className="w-4 h-4" />
              <span>Why Choose VPO?</span>
            </div>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              The Future of <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Prediction Technology</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Experience the next generation of verifiable predictions with cutting-edge technology, 
              unmatched security, and global accessibility.
            </p>
          </div>

          {/* Creative Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Left Column - Two Features */}
            <div className="space-y-8">
              {ecosystemFeatures.slice(0, 2).map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <div className="relative flex items-start space-x-6">
                    {/* Icon Container */}
                    <div className={`relative flex-shrink-0 w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <div className={`text-${feature.accent.replace('bg-', '')}`}>
                        {feature.icon}
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Two Features */}
            <div className="space-y-8">
              {ecosystemFeatures.slice(2, 4).map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <div className="relative flex items-start space-x-6">
                    {/* Icon Container */}
                    <div className={`relative flex-shrink-0 w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <div className={`text-${feature.accent.replace('bg-', '')}`}>
                        {feature.icon}
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="text-center mb-12">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h4>
              <p className="text-gray-600 text-lg">Join the revolution in verifiable predictions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  99.9%
                </div>
                <div className="text-gray-600 font-medium">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  &lt;1s
                </div>
                <div className="text-gray-600 font-medium">Resolution Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  1M+
                </div>
                <div className="text-gray-600 font-medium">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;