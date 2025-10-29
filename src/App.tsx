import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './styles/index.css';
import { useAppStore } from './store/useAppStore';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import AppRouter from './components/AppRouter';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import HowItWorksSection from './components/HowItWorksSection';
import IntegrationSection from './components/IntegrationSection';
import UseCasesSection from './components/UseCasesSection';
import EcosystemSection from './components/EcosystemSection';
import Footer from './components/Footer';

// Create a client for React Query with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
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

  // Track render performance
  React.useEffect(() => {
    startRender();
    return () => endRender();
  }, [startRender, endRender]);

  return (
    <QueryClientProvider client={queryClient}>
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
          <ProblemSection />
          <SolutionSection />
          <HowItWorksSection />
          <IntegrationSection />
          <UseCasesSection />
          <EcosystemSection />
          <Footer />
        </div>
      )}
      
      {/* React Query DevTools - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
};

export default App;
