import React from 'react';
import { Workflow, TrendingUp, Download, Cpu, ShieldCheck } from 'lucide-react';
import { WorkflowStep } from '../types';

const HowItWorksSection: React.FC = () => {
  const workflowSteps: WorkflowStep[] = [
    {
      id: 1,
      title: 'Market Posts Event',
      description: 'Prediction markets create events requiring resolution.',
      icon: 'trending-up',
      color: 'text-blue-600'
    },
    {
      id: 2,
      title: 'Veyra Adapter Fetches Job',
      description: 'Veyra automatically detects and processes resolution requests.',
      icon: 'download',
      color: 'text-green-600'
    },
    {
      id: 3,
      title: 'EigenCloud Computes',
      description: 'AI models process data and generate cryptographic proofs.',
      icon: 'cpu',
      color: 'text-purple-600'
    },
    {
      id: 4,
      title: 'Proof Posted',
      description: 'Cryptographic proof is posted to the blockchain for verification.',
      icon: 'shield-check',
      color: 'text-gray-600'
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trending-up':
        return <TrendingUp className="w-6 h-6" />;
      case 'download':
        return <Download className="w-6 h-6" />;
      case 'cpu':
        return <Cpu className="w-6 h-6" />;
      case 'shield-check':
        return <ShieldCheck className="w-6 h-6" />;
      default:
        return <Workflow className="w-6 h-6" />;
    }
  };

  return (
    <section className="bg-white pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-24 md:pb-32" id="how-it-works">
      <div className="sm:px-6 lg:px-8 bg-gradient-to-b from-[#ffffff] to-[#ffffff]/0 max-w-7xl rounded-3xl mx-auto pt-6 sm:pt-8 pr-4 pb-6 sm:pb-8 pl-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm ring-1 ring-black/5 text-xs font-medium text-gray-700 uppercase tracking-wide">
            <Workflow className="w-3.5 h-3.5 text-gray-800" />
            <span>How It Works</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mt-4 sm:mt-6">
            4 Simple Steps to <span className="text-gradient">Verifiable Truth</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mt-3 px-4 sm:px-0">
            From prediction market to cryptographic proof in seconds.
          </p>
        </div>
        
        {/* Veyra Workflow Steps */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step) => (
            <WorkflowStepCard key={step.id} step={step} getIcon={getIcon} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface WorkflowStepCardProps {
  step: WorkflowStep;
  getIcon: (iconName: string) => React.ReactNode;
}

const WorkflowStepCard: React.FC<WorkflowStepCardProps> = ({ step, getIcon }) => {
  return (
    <div className="relative bg-white rounded-3xl p-6 sm:p-8 ring-1 ring-black/5 shadow-[0_1px_0_rgba(0,0,0,0.04),_0_12px_30px_rgba(0,0,0,0.06)] group hover:shadow-[0_1px_0_rgba(0,0,0,0.04),_0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2">
      <div className="relative mb-6 sm:mb-10">
        <div 
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white ring-1 ring-black/5 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform duration-500" 
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
      <h3 className={`text-xl sm:text-2xl font-medium tracking-tight text-gray-900 mb-2 group-hover:${step.color} transition-colors duration-300`}>
        {step.title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {step.description}
      </p>
    </div>
  );
};

export default HowItWorksSection;
