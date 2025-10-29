import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  bundleSize?: number;
}

export const usePerformanceMonitor = () => {
  const { updateLastActivity } = useAppStore();
  const renderStartTime = useRef<number>(0);
  const metrics = useRef<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
  });

  // Track render performance
  const startRender = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    if (renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      metrics.current.renderTime = renderTime;
      
      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`Slow render detected: ${renderTime.toFixed(2)}ms`);
      }
    }
  }, []);

  // Track page load performance
  useEffect(() => {
    const trackLoadTime = () => {
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        metrics.current.loadTime = loadTime;
        
        // Log performance metrics in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Performance Metrics:', {
            loadTime: `${loadTime}ms`,
            renderTime: `${metrics.current.renderTime.toFixed(2)}ms`,
            memoryUsage: (performance as any).memory ? 
              `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB` : 'N/A'
          });
        }
      }
    };

    // Track when page is fully loaded
    if (document.readyState === 'complete') {
      trackLoadTime();
    } else {
      window.addEventListener('load', trackLoadTime);
      return () => window.removeEventListener('load', trackLoadTime);
    }
  }, []);

  // Track memory usage
  useEffect(() => {
    const trackMemory = () => {
      if ((performance as any).memory) {
        metrics.current.memoryUsage = (performance as any).memory.usedJSHeapSize;
      }
    };

    const interval = setInterval(trackMemory, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Track user activity for performance optimization
  useEffect(() => {
    const handleActivity = () => {
      updateLastActivity();
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [updateLastActivity]);

  // Track bundle size (approximate)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // This is a rough estimate - in production you'd get this from webpack stats
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      
      scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src && src.includes('static/js')) {
          // This is a rough estimate - actual size would need to be measured
          totalSize += 100; // KB estimate
        }
      });
      
      metrics.current.bundleSize = totalSize;
    }
  }, []);

  return {
    metrics: metrics.current,
    startRender,
    endRender,
  };
};

// Hook for measuring component render performance
export const useRenderTimer = (componentName: string) => {
  const { startRender, endRender } = usePerformanceMonitor();
  
  useEffect(() => {
    startRender();
    return () => {
      endRender();
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render completed`);
      }
    };
  }, [componentName, startRender, endRender]);
};
