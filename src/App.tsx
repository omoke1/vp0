import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './styles/index.css';
import { useAppStore } from './store/useAppStore';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { Web3Provider } from './providers/Web3Provider';
import AppRouter from './components/AppRouter';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load heavy components for better code splitting
const ProblemSection = React.lazy(() => import('./components/ProblemSection'));
const SolutionSection = React.lazy(() => import('./components/SolutionSection'));
const HowItWorksSection = React.lazy(() => import('./components/HowItWorksSection'));
const IntegrationSection = React.lazy(() => import('./components/IntegrationSection'));
const UseCasesSection = React.lazy(() => import('./components/UseCasesSection'));
const EcosystemSection = React.lazy(() => import('./components/EcosystemSection'));
const Footer = React.lazy(() => import('./components/Footer'));

// Create a client for React Query with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error && typeof error.status === 'number') {
          if (error.status >= 400 && error.status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  const { isAppLaunched } = useAppStore();
  const { startRender, endRender } = usePerformanceMonitor();

  // Track isAppLaunched changes for debugging
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Veyra App component - isAppLaunched changed:', isAppLaunched);
    }
  }, [isAppLaunched]);

  // Track render performance
  React.useEffect(() => {
    startRender();
    return () => endRender();
  }, [startRender, endRender]);

  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider queryClient={queryClient}>
        {/* If app is launched, show the router (dashboard, markets, etc.) */}
        {isAppLaunched ? (
          <AppRouter />
        ) : (
          /* Otherwise, show the landing page */
          <div className="bg-white text-gray-900 antialiased selection:bg-blue-200 selection:text-blue-900">
            {/* Video Background */}
            <div className="video-background-container top-0 w-full -z-10 absolute h-screen">
              <video
                src="https://cdn.midjourney.com/video/af6b100b-cd15-4257-b845-8a5388a23f1b/3.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <Navigation />
            <HeroSection />
            
            {/* Lazy loaded sections with Suspense */}
            <Suspense fallback={<LoadingSpinner size="md" text="Loading content..." variant="crystal" />}>
              <ProblemSection />
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner size="md" text="Loading content..." variant="crystal" />}>
              <SolutionSection />
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner size="md" text="Loading content..." variant="crystal" />}>
              <HowItWorksSection />
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner size="md" text="Loading content..." variant="crystal" />}>
              <IntegrationSection />
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner size="md" text="Loading content..." variant="crystal" />}>
              <UseCasesSection />
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner size="md" text="Loading content..." variant="crystal" />}>
              <EcosystemSection />
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner size="md" text="Loading content..." variant="crystal" />}>
              <Footer />
            </Suspense>
          </div>
        )}

        {/* React Query DevTools - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools
            initialIsOpen={false}
            position="bottom"
          />
        )}
      </Web3Provider>
    </QueryClientProvider>
  );
};

export default App;
