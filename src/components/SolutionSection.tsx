import React from 'react';
import { ShieldCheck, BarChart3, Bot, Diamond, HandMetal, Gamepad2, Workflow, Wand2, Sparkles, User } from 'lucide-react';
import { SolutionCardProps } from '../types';

const SolutionSection: React.FC = () => {
  const handleGenerate = () => {
    console.log('Generate clicked');
  };

  return (
    <section className="bg-[#ffffff] pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm ring-1 ring-black/5 text-xs font-medium text-gray-700 uppercase tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-800" />
            <span>The Solution</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight mt-4 sm:mt-6 px-4 sm:px-0">
            VPO turns computation into <span className="text-gradient">cryptographic truth</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mt-3 px-4 sm:px-0">
            From data to proof — no humans, no delays.
          </p>
        </div>

        {/* Solution Cards Grid */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Content Generation (tall) */}
          <ContentGenerationCard onGenerate={handleGenerate} />
          
          {/* AI Strategy Consulting */}
          <AIStrategyCard />
          
          {/* Automated Workflows */}
          <AutomatedWorkflowsCard />
          
          {/* AI-Powered Chatbots (tall) */}
          <AIChatbotsCard />
        </div>

        {/* Marquee Track */}
        <div className="flex items-center gap-3 whitespace-nowrap mt-16 overflow-hidden" style={{ animation: 'marquee-rtl 28s linear infinite', willChange: 'transform' }}>
          {/* Track Copy 1 */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-sm font-medium text-gray-500">Polymarket</div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="text-sm font-medium text-gray-500">VPO Adapter</div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="text-sm font-medium text-gray-500">EigenCloud</div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="text-sm font-medium text-gray-500">Cryptographic Proof</div>
          </div>
          {/* Track Copy 2 */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-sm font-medium text-gray-500">Polymarket</div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="text-sm font-medium text-gray-500">VPO Adapter</div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="text-sm font-medium text-gray-500">EigenCloud</div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="text-sm font-medium text-gray-500">Cryptographic Proof</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContentGenerationCard: React.FC<{ onGenerate: () => void }> = ({ onGenerate }) => {
  return (
    <div className="relative lg:row-span-2 bg-white ring-black/5 ring-1 rounded-3xl pt-6 sm:pt-8 pr-6 sm:pr-8 pb-6 sm:pb-8 pl-6 sm:pl-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <button 
        onClick={onGenerate}
        className="absolute right-4 sm:right-6 top-4 sm:top-6 text-xs sm:text-sm font-medium text-gray-800 bg-white ring-black/5 ring-1 rounded-full pt-1 sm:pt-1.5 pr-3 sm:pr-4 pb-1 sm:pb-1.5 pl-3 sm:pl-4 shadow-[0_3px_12px_rgba(0,0,0,0.15)]"
      >
        Generate
      </button>

      <div className="bg-neutral-50 border-gray-200/60 border rounded-2xl mt-8 sm:mt-14 pt-3 sm:pt-4 pr-3 sm:pr-4 pb-3 sm:pb-4 pl-3 sm:pl-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center mb-3">
          {/* Empty space for potential icon */}
        </div>
        <div className="space-y-2 text-xs sm:text-sm text-gray-700">
          <div className="ring-1 ring-black/5 bg-white rounded-lg pt-2 sm:pt-3 pr-3 sm:pr-4 pb-2 sm:pb-3 pl-3 sm:pl-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
            Continue writing
          </div>
          <div className="bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 ring-1 ring-black/5 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
            Fix spelling
          </div>
          <div className="bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 ring-1 ring-black/5 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
            Explain in detail
          </div>
        </div>
      </div>

      <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 tracking-tight mt-6 sm:mt-8 mb-2">
        Content Generation
      </h3>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
        We provide seamless content creation solutions that generate captivating, high-quality content in line with your brand's voice.
      </p>
    </div>
  );
};

const AIStrategyCard: React.FC = () => {
  return (
    <div className="relative bg-white rounded-3xl p-6 sm:p-8 ring-1 ring-black/5 shadow-[0_1px_0_rgba(0,0,0,0.04),_0_12px_30px_rgba(0,0,0,0.06)]">
      <div className="relative mb-6 sm:mb-10">
        <div 
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white ring-1 ring-black/5 flex items-center justify-center text-gray-900" 
          style={{ boxShadow: '0 10px 22px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)' }}
        >
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <span 
          className="absolute left-12 sm:left-16 top-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white ring-1 ring-black/5" 
          style={{ boxShadow: '0 8px 18px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)' }}
        />
        <span 
          className="absolute left-6 sm:left-8 top-12 sm:top-16 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white ring-1 ring-black/5" 
          style={{ boxShadow: '0 6px 14px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)' }}
        />
      </div>
      <h3 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-gray-900 mb-2">
        AI Strategy Consulting
      </h3>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
        Get expert guidance to implement AI solutions that drive business growth.
      </p>
    </div>
  );
};

const AutomatedWorkflowsCard: React.FC = () => {
  const workflowIcons = [
    { icon: Bot, size: 'w-14 h-14' },
    { icon: Diamond, size: 'w-16 h-16' },
    { icon: HandMetal, size: 'w-14 h-14' },
    { icon: Gamepad2, size: 'w-14 h-14' },
    { icon: Workflow, size: 'w-14 h-14' },
    { icon: ShieldCheck, size: 'w-16 h-16' },
    { icon: Wand2, size: 'w-14 h-14' },
  ];

  return (
    <div className="relative bg-white rounded-3xl p-6 sm:p-8 ring-1 ring-black/5 shadow-[0_1px_0_rgba(0,0,0,0.04),_0_12px_30px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
        {workflowIcons.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={index}
              className={`col-span-1 h-10 sm:h-14 bg-white rounded-xl ring-1 ring-black/5 flex items-center justify-center`}
              style={{ boxShadow: '0 10px 22px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)' }}
            >
              <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-gray-900" />
            </div>
          );
        })}
      </div>
      <h3 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-gray-900 mb-2">
        Automated Workflows
      </h3>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
        Automate workflows to streamline tasks, boost efficiency, and save time.
      </p>
    </div>
  );
};

const AIChatbotsCard: React.FC = () => {
  return (
    <div className="relative lg:row-span-2 overflow-hidden bg-white max-h-fit ring-black/5 ring-1 rounded-3xl pt-6 sm:pt-8 pr-6 sm:pr-8 pb-6 sm:pb-8 pl-6 sm:pl-8 shadow-[0_1px_0_rgba(0,0,0,0.04),_0_12px_30px_rgba(0,0,0,0.06)]">
      <div 
        className="absolute left-4 sm:left-6 top-4 sm:top-6 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white ring-1 ring-black/5 flex items-center justify-center" 
        style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)' }}
      >
        <Sparkles className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-gray-800" />
      </div>
      
      <div className="absolute left-12 sm:left-16 top-8 sm:top-12 flex gap-1.5">
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></span>
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></span>
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></span>
      </div>

      <div 
        className="absolute left-12 sm:left-16 top-12 sm:top-16 bg-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm ring-1 ring-black/5 flex items-center gap-2 sm:gap-3" 
        style={{ boxShadow: '0 10px 22px rgba(0,0,0,0.10)' }}
      >
        <span className="text-gray-700">Set up a Zoom call with Emily at 10:00 AM on Wednesday.</span>
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-900 text-white flex items-center justify-center">
          <User className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      </div>

      <div className="mt-20 sm:mt-28 mb-6 sm:mb-10">
        <div 
          className="w-full h-12 sm:h-14 bg-white rounded-full ring-1 ring-black/5 flex items-center px-4 sm:px-5 text-xs sm:text-sm text-gray-400" 
          style={{ boxShadow: 'inset 0 5px 14px rgba(0,0,0,0.10), inset 0 -1px 0 rgba(0,0,0,0.03)' }}
        >
          Type a message
        </div>
      </div>

      <h3 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-gray-900 mb-2">
        AI-Powered Chatbots
      </h3>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
        We develop AI-driven chatbots with advanced cognitive technologies to elevate customer support and automate business operations.
      </p>
    </div>
  );
};

export default SolutionSection;
