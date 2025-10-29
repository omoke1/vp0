import React, { Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

// Lazy load pages for code splitting with error boundaries
const Dashboard = lazy(() => 
  import('../pages/Dashboard').catch(() => ({
    default: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load Dashboard</h2>
          <p className="text-gray-600">Please refresh the page to try again.</p>
        </div>
      </div>
    )
  }))
);

const Markets = lazy(() => 
  import('../pages/Markets').catch(() => ({
    default: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load Markets</h2>
          <p className="text-gray-600">Please refresh the page to try again.</p>
        </div>
      </div>
    )
  }))
);

const Oracle = lazy(() => 
  import('../pages/Oracle').catch(() => ({
    default: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load Oracle</h2>
          <p className="text-gray-600">Please refresh the page to try again.</p>
        </div>
      </div>
    )
  }))
);

// Enhanced loading fallback with progress indication
const LoadingFallback: React.FC<{ route: string }> = memo(({ route }) => {
  const getLoadingText = () => {
    switch (route) {
      case '/dashboard':
        return 'Loading your dashboard...';
      case '/markets':
        return 'Loading prediction markets...';
      case '/oracle':
        return 'Loading oracle services...';
      default:
        return 'Loading Veyra...';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <LoadingSpinner 
        size="xl" 
        text={getLoadingText()}
        variant="crystal"
        showIcon={true}
        progress={75}
      />
    </div>
  );
});

LoadingFallback.displayName = 'LoadingFallback';

const AppRouter: React.FC = () => {
  const { isAppLaunched, isLoading, error, clearError } = useAppStore();

  // Debug: Log AppRouter state in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Veyra AppRouter - isAppLaunched:', isAppLaunched, 'isLoading:', isLoading, 'error:', error);
    }
  }, [isAppLaunched, isLoading, error]);

  // If app hasn't been launched, don't show router
  if (!isAppLaunched) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚫 Veyra AppRouter - App not launched, returning null');
    }
    return null;
  }

  // Show error state if there's a global error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 card-glow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">
              Application Error
            </h2>
            <p className="text-gray-600 mb-6 font-inter">
              {error}
            </p>
            <button
              onClick={clearError}
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover-lift shadow-lg font-inter"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary level="page">
      <Router>
        <Suspense fallback={<LoadingFallback route="/" />}>
          <Routes>
            <Route 
              path="/dashboard" 
              element={
                <Suspense fallback={<LoadingFallback route="/dashboard" />}>
                  <Dashboard />
                </Suspense>
              } 
            />
            <Route 
              path="/markets" 
              element={
                <Suspense fallback={<LoadingFallback route="/markets" />}>
                  <Markets />
                </Suspense>
              } 
            />
            <Route 
              path="/oracle" 
              element={
                <Suspense fallback={<LoadingFallback route="/oracle" />}>
                  <Oracle />
                </Suspense>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default memo(AppRouter);
