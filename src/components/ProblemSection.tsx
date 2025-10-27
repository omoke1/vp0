import React from 'react';
import { AlertTriangle, Clock, Users, DollarSign, Database } from 'lucide-react';
import { ProblemCardProps } from '../types';

const ProblemSection: React.FC = () => {
  const problemCards: ProblemCardProps[] = [
    {
      title: 'Manual Resolution Delays',
      description: 'Markets wait days or weeks for human resolution, creating uncertainty and opportunity costs.',
      iconName: 'clock',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Human Subjectivity & Bias',
      description: 'Resolution decisions are influenced by human judgment, leading to inconsistent and potentially biased outcomes.',
      iconName: 'users',
      iconColor: 'text-green-600'
    },
    {
      title: 'High Dispute Costs',
      description: 'Disagreements over resolution outcomes lead to expensive arbitration and legal proceedings.',
      iconName: 'dollar-sign',
      iconColor: 'text-purple-600'
    },
    {
      title: 'No AI/Data Support',
      description: 'Current systems cannot leverage AI models or real-time data feeds for automated resolution.',
      iconName: 'database',
      iconColor: 'text-gray-600'
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'clock':
        return <Clock className="w-6 h-6" />;
      case 'users':
        return <Users className="w-6 h-6" />;
      case 'dollar-sign':
        return <DollarSign className="w-6 h-6" />;
      case 'database':
        return <Database className="w-6 h-6" />;
      default:
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  return (
    <section className="bg-neutral-100 pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-24 md:pb-32">
      <div className="sm:px-6 lg:px-8 max-w-7xl mx-auto pr-4 pl-4">
        {/* Header */}
        <div className="text mb-8 sm:mb-12 md:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm ring-1 ring-black/5 mb-4 sm:mb-6">
            <AlertTriangle className="w-3.5 h-3.5 text-gray-800" />
            <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">The Problem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
            Prediction markets today rely on <span className="text-gray-600">trust</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
            Current prediction markets face fundamental challenges that limit their potential and create systemic risks.
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {problemCards.map((card, index) => (
            <ProblemCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProblemCard: React.FC<ProblemCardProps> = ({ title, description, iconName, iconColor }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'clock':
        return <Clock className="w-6 h-6" />;
      case 'users':
        return <Users className="w-6 h-6" />;
      case 'dollar-sign':
        return <DollarSign className="w-6 h-6" />;
      case 'database':
        return <Database className="w-6 h-6" />;
      default:
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  return (
    <div className="relative bg-white rounded-3xl p-6 sm:p-8 ring-1 ring-black/5 shadow-[0_1px_0_rgba(0,0,0,0.04),_0_12px_30px_rgba(0,0,0,0.06)] group hover:shadow-[0_1px_0_rgba(0,0,0,0.04),_0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2">
      <div className="relative mb-6 sm:mb-10">
        <div 
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white ring-1 ring-black/5 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform duration-500" 
          style={{ boxShadow: '0 10px 22px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)' }}
        >
          {getIcon(iconName)}
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
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ProblemSection;
