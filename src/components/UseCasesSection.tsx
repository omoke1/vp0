import React from 'react';
import { Cpu, ShieldAlert, Trophy, Users } from 'lucide-react';
import { UseCase } from '../types';

const UseCasesSection: React.FC = () => {
  const useCases: UseCase[] = [
    {
      id: 1,
      title: 'AI Model Competitions',
      description: 'Automatically resolve competitions between AI models based on objective performance metrics.',
      icon: 'cpu',
      examples: [
        'ImageNet classification accuracy',
        'Natural language understanding benchmarks',
        'Code generation quality assessments'
      ]
    },
    {
      id: 2,
      title: 'Risk Assessment',
      description: 'Provide verifiable risk scores for insurance, lending, and investment decisions.',
      icon: 'shield-alert',
      examples: [
        'Credit default probability',
        'Insurance claim likelihood',
        'Market volatility predictions'
      ]
    },
    {
      id: 3,
      title: 'Sports & Entertainment',
      description: 'Resolve sports outcomes, award shows, and entertainment events automatically.',
      icon: 'trophy',
      examples: [
        'NFL game outcomes',
        'Oscar award predictions',
        'Music chart rankings'
      ]
    },
    {
      id: 4,
      title: 'Social & Political Events',
      description: 'Provide unbiased resolution for political elections and social events.',
      icon: 'users',
      examples: [
        'Election results verification',
        'Public opinion polls',
        'Social media sentiment analysis'
      ]
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'cpu':
        return <Cpu className="w-6 h-6" />;
      case 'shield-alert':
        return <ShieldAlert className="w-6 h-6" />;
      case 'trophy':
        return <Trophy className="w-6 h-6" />;
      case 'users':
        return <Users className="w-6 h-6" />;
      default:
        return <Cpu className="w-6 h-6" />;
    }
  };

  return (
    <section className="bg-neutral-100 pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-24 md:pb-32" id="use-cases">
      <div className="sm:px-6 lg:px-8 max-w-7xl mx-auto pr-4 pl-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm ring-1 ring-black/5 mb-4 sm:mb-6">
            <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Use Cases</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
            Example <span className="text-gradient">Use Cases</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
            VPO enables verifiable resolution for a wide range of prediction market scenarios
          </p>
        </div>
        
        {/* Use Cases Grid */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
          {useCases.map((useCase) => (
            <UseCaseCard key={useCase.id} useCase={useCase} getIcon={getIcon} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface UseCaseCardProps {
  useCase: UseCase;
  getIcon: (iconName: string) => React.ReactNode;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase, getIcon }) => {
  return (
    <div className="relative bg-white rounded-3xl p-6 sm:p-8 ring-1 ring-black/5 shadow-[0_1px_0_rgba(0,0,0,0.04),_0_12px_30px_rgba(0,0,0,0.06)] group hover:shadow-[0_1px_0_rgba(0,0,0,0.04),_0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2">
      <div className="relative mb-6 sm:mb-10">
        <div 
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white ring-1 ring-black/5 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform duration-500" 
          style={{ boxShadow: '0 10px 22px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)' }}
        >
          {getIcon(useCase.icon)}
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
      
      <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
        {useCase.title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
        {useCase.description}
      </p>
      
      {/* Examples */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-800 mb-3">Examples:</h4>
        {useCase.examples.map((example, index) => (
          <div 
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
          >
            {example}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UseCasesSection;
