import React, { memo } from 'react';
import { Loader2, Zap, Cpu, Database } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  variant?: 'default' | 'crystal' | 'dots' | 'pulse';
  showIcon?: boolean;
  progress?: number; // 0-100 for progress indication
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({ 
  size = 'md', 
  text = 'Loading...',
  className = '',
  variant = 'default',
  showIcon = false,
  progress
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const getIcon = () => {
    if (!showIcon) return null;
    
    const iconSize = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    
    switch (variant) {
      case 'crystal':
        return <Cpu className={`${iconSize} text-blue-500`} />;
      case 'dots':
        return <Database className={`${iconSize} text-purple-500`} />;
      default:
        return <Zap className={`${iconSize} text-blue-500`} />;
    }
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'crystal':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            {/* Crystal effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 animate-pulse-soft">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400/30 to-purple-500/30 animate-spin"></div>
            </div>
            <div className="relative w-full h-full rounded-full border-2 border-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-spin">
              <div className="absolute inset-1 rounded-full bg-white/90 backdrop-blur-sm"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-soft"></div>
            </div>
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-ping opacity-75"></div>
            <div className="relative w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"></div>
          </div>
        );
      
      default:
        return (
          <div className={`${sizeClasses[size]} relative`}>
            {/* Outer ring with gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-spin">
              <div className="w-full h-full rounded-full bg-white/20"></div>
            </div>
            {/* Inner ring */}
            <div className="relative w-full h-full rounded-full border-4 border-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-spin">
              <div className="absolute inset-1 rounded-full bg-white"></div>
            </div>
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-soft"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex items-center gap-3">
        {renderSpinner()}
        {getIcon()}
      </div>
      
      {text && (
        <div className="mt-4 text-center">
          <p className={`${textSizeClasses[size]} text-gray-600 animate-pulse font-inter`}>
            {text}
          </p>
          {progress !== undefined && (
            <div className="mt-2 w-32 bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
