import React from 'react';
import { Workflow, TrendingUp, Zap, Cloud, ShieldCheck } from 'lucide-react';
import { IntegrationStep } from '../types';

const IntegrationSection: React.FC = () => {
  const integrationSteps: IntegrationStep[] = [
    {
      id: 1,
      title: 'Polymarket',
      description: 'Prediction Market Platform',
      icon: 'trending-up',
      position: 'left'
    },
    {
      id: 2,
      title: 'Veyra Adapter',
      description: 'Smart Contract Integration',
      icon: 'zap',
      position: 'center'
    },
    {
      id: 3,
      title: 'EigenCloud',
      description: 'AI Computation Layer',
      icon: 'cloud',
      position: 'center'
    },
    {
      id: 4,
      title: 'Blockchain',
      description: 'Cryptographic Proof Storage',
      icon: 'shield-check',
      position: 'right'
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trending-up':
        return <TrendingUp className="w-6 h-6" />;
      case 'zap':
        return <Zap className="w-6 h-6" />;
      case 'cloud':
        return <Cloud className="w-6 h-6" />;
      case 'shield-check':
        return <ShieldCheck className="w-6 h-6" />;
      default:
        return <Workflow className="w-6 h-6" />;
    }
  };

  return (
    <section className="bg-neutral-100 pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-24 md:pb-32" id="integrations">
      <div className="sm:px-6 lg:px-8 max-w-7xl mx-auto pr-4 pl-4">
        {/* Integration Architecture */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 ring-1 ring-black/5 shadow-[0_1px_0_rgba(0,0,0,0.04),_0_12px_30px_rgba(0,0,0,0.06)]">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm ring-1 ring-black/5 mb-4 sm:mb-6">
              <Workflow className="w-3.5 h-3.5 text-gray-800" />
              <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Architecture</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 mb-4">
              Integration Architecture
            </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              Veyra connects seamlessly with existing prediction market infrastructure
            </p>
          </div>
          
          {/* Professional Integration Flow */}
          <div className="relative">
            {/* Flow Container */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8">
              {integrationSteps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <IntegrationStepCard step={step} getIcon={getIcon} />
                  {index < integrationSteps.length - 1 && (
                    <div className="hidden sm:block w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Technical Details */}
          <div className="mt-12 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2">
            <TechnicalDetailCard
              title="Seamless Integration"
              description="Plug-and-play adapter connects to existing prediction market infrastructure without requiring protocol changes."
              icon={<Zap className="w-6 h-6" />}
            />
            <TechnicalDetailCard
              title="Instant Resolution"
              description="Cryptographic proofs enable automatic market resolution in seconds, eliminating manual intervention and disputes."
              icon={<ShieldCheck className="w-6 h-6" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface IntegrationStepCardProps {
  step: IntegrationStep;
  getIcon: (iconName: string) => React.ReactNode;
}

const IntegrationStepCard: React.FC<IntegrationStepCardProps> = ({ step, getIcon }) => {
  return (
    <div className="relative text-center group">
      <div className="relative mb-6 sm:mb-10">
        <div 
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white ring-1 ring-black/5 flex items-center justify-center text-gray-900 mx-auto group-hover:scale-110 transition-transform duration-500" 
          style={{ boxShadow: '0 10px 22px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)' }}
        >
          {getIcon(step.icon)}
        </div>
        <span 
          className="absolute left-12 sm:left-16 top-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white ring-1 ring-black/5 group-hover:animate-pulse transition-all duration-300" 
          style={{ boxShadow: '0 8px 18px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)' }}
        />
        <span 
          className="absolute left-6 sm:left-8 top-12 sm:top-16 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white ring-1 ring-black/5 group-hover:animate-bounce transition-all duration-300" 
          style={{ boxShadow: '0 6px 14px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)' }}
        />
      </div>
      <h4 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
        {step.title}
      </h4>
      <p className="text-sm sm:text-base text-gray-600">
        {step.description}
      </p>
    </div>
  );
};

interface TechnicalDetailCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const TechnicalDetailCard: React.FC<TechnicalDetailCardProps> = ({ title, description, icon }) => {
  return (
    <div className="relative bg-white rounded-3xl p-6 sm:p-8 ring-1 ring-black/5 shadow-[0_1px_0_rgba(0,0,0,0.04),_0_12px_30px_rgba(0,0,0,0.06)] group hover:shadow-[0_1px_0_rgba(0,0,0,0.04),_0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2">
      <div className="relative mb-6 sm:mb-8">
        <div 
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white ring-1 ring-black/5 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform duration-500" 
          style={{ boxShadow: '0 10px 22px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)' }}
        >
          {icon}
        </div>
        <span 
          className="absolute left-12 sm:left-16 top-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white ring-1 ring-black/5 group-hover:animate-pulse transition-all duration-300" 
          style={{ boxShadow: '0 8px 18px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)' }}
        />
        <span 
          className="absolute left-6 sm:left-8 top-12 sm:top-16 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white ring-1 ring-black/5 group-hover:animate-bounce transition-all duration-300" 
          style={{ boxShadow: '0 6px 14px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)' }}
        />
      </div>
      <h4 className="text-xl sm:text-2xl font-medium tracking-tight text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
        {title}
      </h4>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default IntegrationSection;
