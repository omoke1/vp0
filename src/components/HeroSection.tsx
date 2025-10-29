import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const handleLaunchApp = () => {
    // Handle launch app action
    console.log('Launch App clicked');
  };

  const handleReadWhitepaper = () => {
    // Handle read whitepaper action
    console.log('Read Whitepaper clicked');
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ isolation: 'isolate' }}>
        
        {/* Ripple background */}
        <div className="absolute inset-0 -z-10 flex bg-[#ffffff]/50 items-center justify-center">
          {/* Soft concentric ripples (masked for fade-out) */}
          <div 
            className="w-[1200px] sm:w-[1400px] md:w-[1600px] h-[1200px] sm:h-[1400px] md:h-[1600px] rounded-full" 
            style={{
              background: `
                radial-gradient(circle at 50% 60%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 18%, rgba(0,0,0,0.02) 26%, rgba(0,0,0,0) 30%) ,
                radial-gradient(circle at 50% 60%, rgba(0,0,0,0.06) 34%, rgba(0,0,0,0) 38%) ,
                radial-gradient(circle at 50% 60%, rgba(0,0,0,0.04) 44%, rgba(0,0,0,0) 48%) ,
                radial-gradient(circle at 50% 60%, rgba(0,0,0,0.03) 54%, rgba(0,0,0,0) 58%)
              `,
              filter: 'blur(6px)',
              opacity: 0.35,
              maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 80%)',
              WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 80%)',
              transform: 'translateY(6vh) scaleX(1.25)'
            }}
          />
        </div>

        {/* Orb + content */}
        <div className="relative aspect-square flex w-[85vw] sm:w-[90vw] max-w-3xl items-center justify-center">
          {/* Orb */}
          <div 
            className="absolute inset-0 ring-black/5 ring-1 rounded-full shadow-inner blur-3xl" 
            style={{
              background: `
                radial-gradient(120% 120% at 30% 25%, rgba(255,255,255,0.95) 0%, rgba(245,245,245,0.95) 55%, rgba(230,230,230,0.9) 100%),
                radial-gradient(60% 60% at 65% 70%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)
              `,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transform: 'scale(1.0)'
            }}
          >
            {/* Crystal glow effect inside orb */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div 
                className="absolute inset-0 rounded-full animate-pulse-soft crystal-glow"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(100, 200, 255, 0.4) 0%, rgba(150, 100, 255, 0.3) 30%, rgba(255, 150, 200, 0.2) 60%, transparent 80%)'
                }}
              />
              <div 
                className="absolute inset-0 rounded-full crystal-glow-2"
                style={{
                  background: 'radial-gradient(circle at 70% 60%, rgba(255, 200, 100, 0.3) 0%, rgba(100, 255, 200, 0.25) 40%, transparent 70%)'
                }}
              />
              <div 
                className="absolute inset-0 rounded-full crystal-glow-3"
                style={{
                  background: 'radial-gradient(circle at 50% 10%, rgba(200, 100, 255, 0.2) 0%, rgba(100, 255, 150, 0.15) 50%, transparent 80%)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 flex flex-col items-center justify-center h-full">
        {/* Brand */}
        <div className="animate-fade-in-up mb-4 sm:mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 shadow-sm ring-1 ring-black/5 text-xs font-medium text-gray-700 uppercase tracking-wide">
            <img 
              src="/assets/vpo-logo-simple.svg" 
              alt="VPO Logo" 
              className="w-4 h-4"
            />
            VPO
          </span>
        </div>

        {/* Brand + Title */}
        <div className="flex items-center gap-2 sm:gap-4 justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-gray-900 tracking-tight">
            VERIFIABLE TRUTH
          </h1>
        </div>

        {/* Subcopy */}
        <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Resolve any prediction or data event — automatically, cryptographically, and without human bias
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 items-center justify-center max-w-md sm:max-w-none mx-auto">
          <button 
            onClick={handleLaunchApp}
            className="relative inline-flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 hover:ring-sky-400/60 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.35),0_40px_80px_rgba(56,189,248,0.18)] group ring-[#ffffff]/30 ring-1 text-sm sm:text-base font-semibold text-white tracking-tight bg-neutral-950/95 rounded-full pt-3 pr-6 pb-3 pl-6 shadow-[0_0_0_1px_rgba(56,189,248,0.25),inset_0_0_0_1px_rgba(255,255,255,0.08)] w-full sm:w-auto"
          >
            <span className="relative z-[1] group-hover:translate-x-1 transition-transform duration-300">
              Launch App
            </span>
            <ArrowRight className="relative z-[1] w-4 h-4 text-sky-100 group-hover:translate-x-2 transition-transform duration-300" />
            <span 
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{
                background: 'linear-gradient(45deg, rgba(56,189,248,0.8) 0%, rgba(99,102,241,0.8) 50%, rgba(168,85,247,0.8) 100%)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
            <span 
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                boxShadow: '0 0 0 1px rgba(56,189,248,0.45), 0 18px 60px rgba(56,189,248,0.25)',
                background: 'radial-gradient(140% 160% at 50% -20%, rgba(56,189,248,0.22) 0%, rgba(56,189,248,0.08) 35%, rgba(56,189,248,0.00) 60%)'
              }}
            />
            <span 
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(120% 80% at 50% -20%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 55%, rgba(255,255,255,0) 60%), radial-gradient(90% 80% at 50% 120%, rgba(56,189,248,0.18) 0%, rgba(56,189,248,0) 60%)'
              }}
            />
          </button>
          
          <button 
            onClick={handleReadWhitepaper}
            className="relative w-full sm:w-[14em] h-[3em] rounded-[30em] text-sm sm:text-[15px] font-inherit border-none overflow-hidden z-[1] shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] before:content-[''] before:absolute before:top-0 before:left-0 before:h-[3em] before:w-0 before:rounded-[30em] before:bg-gradient-to-r before:from-[#881BB6] before:to-[#E1A4FF] before:transition-[width] before:duration-500 before:ease-in-out before:z-[-1] hover:before:w-full sm:hover:before:w-[14em]"
          >
            Read Whitepaper
          </button>
        </div>
      </div>

      {/* Soft ground shadow under orb */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120%] h-24 sm:h-32"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, transparent 70%)',
          filter: 'blur(20px)'
        }}
      />
    </section>
  );
};

export default HeroSection;
