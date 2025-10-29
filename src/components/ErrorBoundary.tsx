import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  level?: 'page' | 'component';
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement error reporting service
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      });
    }
    
    this.setState({ errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      const isPageLevel = this.props.level === 'page';
      
      if (isPageLevel) {
        return <PageErrorFallback error={this.state.error!} resetError={this.resetError} />;
      }
      
      return <ComponentErrorFallback error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

// Page-level error fallback
const PageErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ error, resetError }) => {
  const { launchApp } = useAppStore();

  const handleGoHome = () => {
    resetError();
    launchApp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 card-glow">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <div className="absolute inset-0 w-20 h-20 rounded-full bg-red-200/30 animate-pulse-soft"></div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-inter">
            Oops! Something went wrong
          </h2>
          
          <p className="text-gray-600 mb-6 text-lg font-inter">
            We encountered an unexpected error. Don't worry, your data is safe.
          </p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2 font-inter">Error Details:</h3>
              <code className="text-sm text-red-600 break-all">{error.message}</code>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetError}
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover-lift shadow-lg font-inter"
            >
              <span className="relative z-10 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse-soft"></div>
            </button>
            
            <button
              onClick={handleGoHome}
              className="relative bg-white/50 text-gray-700 py-3 px-6 rounded-xl hover:bg-white/70 transition-all duration-300 hover-lift border border-gray-200/50 font-inter"
            >
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </span>
            </button>
          </div>

          {/* Support Link */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-inter">
              If this problem persists, please{' '}
              <a 
                href="mailto:support@vpo.io" 
                className="text-blue-600 hover:text-blue-700 underline"
              >
                contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component-level error fallback
const ComponentErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ error, resetError }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
      <div className="flex items-start">
        <Bug className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 font-inter">
            Component Error
          </h3>
          <p className="text-sm text-red-700 mt-1 font-inter">
            {error.message}
          </p>
          <button
            onClick={resetError}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline font-inter"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;