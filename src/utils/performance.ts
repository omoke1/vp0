import { performanceConfig } from '../config/wagmi';

export interface PerformanceMetric {
  id: string;
  operation: string;
  duration: number;
  timestamp: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

export interface WebVitals {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private webVitals: Partial<WebVitals> = {};
  private isEnabled: boolean;
  private sampleRate: number;
  private maxMetrics: number;
  private flushInterval: number;
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.isEnabled = performanceConfig.enableMetrics;
    this.sampleRate = performanceConfig.sampleRate;
    this.maxMetrics = performanceConfig.maxMetrics;
    this.flushInterval = performanceConfig.flushInterval;

    if (this.isEnabled) {
      this.initializeWebVitals();
      this.startFlushTimer();
    }
  }

  /**
   * Start timing an operation
   */
  startTiming(operation: string, id?: string): string {
    if (!this.isEnabled || Math.random() > this.sampleRate) {
      return '';
    }

    const timingId = id || `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    performance.mark(`${timingId}_start`);
    
    return timingId;
  }

  /**
   * End timing an operation
   */
  endTiming(
    timingId: string, 
    success: boolean = true, 
    error?: string,
    metadata?: Record<string, any>
  ): void {
    if (!timingId || !this.isEnabled) return;

    try {
      performance.mark(`${timingId}_end`);
      performance.measure(timingId, `${timingId}_start`, `${timingId}_end`);
      
      const measure = performance.getEntriesByName(timingId, 'measure')[0];
      if (measure) {
        const metric: PerformanceMetric = {
          id: timingId,
          operation: timingId.split('_')[0],
          duration: measure.duration,
          timestamp: Date.now(),
          success,
          error,
          metadata,
        };

        this.addMetric(metric);
        
        // Clean up performance marks
        performance.clearMarks(`${timingId}_start`);
        performance.clearMarks(`${timingId}_end`);
        performance.clearMeasures(timingId);
      }
    } catch (error) {
      console.warn('Failed to end timing:', error);
    }
  }

  /**
   * Measure a function execution
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const timingId = this.startTiming(operation);
    
    try {
      const result = await fn();
      this.endTiming(timingId, true, undefined, metadata);
      return result;
    } catch (error) {
      this.endTiming(timingId, false, (error as Error).message, metadata);
      throw error;
    }
  }

  /**
   * Measure a synchronous function execution
   */
  measureSync<T>(
    operation: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    const timingId = this.startTiming(operation);
    
    try {
      const result = fn();
      this.endTiming(timingId, true, undefined, metadata);
      return result;
    } catch (error) {
      this.endTiming(timingId, false, (error as Error).message, metadata);
      throw error;
    }
  }

  /**
   * Add a custom metric
   */
  addCustomMetric(
    operation: string,
    duration: number,
    success: boolean = true,
    error?: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.isEnabled || Math.random() > this.sampleRate) return;

    const metric: PerformanceMetric = {
      id: `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      operation,
      duration,
      timestamp: Date.now(),
      success,
      error,
      metadata,
    };

    this.addMetric(metric);
  }

  /**
   * Get performance statistics
   */
  getStats(): {
    totalOperations: number;
    successfulOperations: number;
    failedOperations: number;
    averageDuration: number;
    medianDuration: number;
    p95Duration: number;
    p99Duration: number;
    operationsByType: Record<string, number>;
    errorRate: number;
    webVitals: Partial<WebVitals>;
  } {
    const successful = this.metrics.filter(m => m.success);
    const failed = this.metrics.filter(m => !m.success);
    const durations = this.metrics.map(m => m.duration).sort((a, b) => a - b);

    const operationsByType: Record<string, number> = {};
    this.metrics.forEach(m => {
      operationsByType[m.operation] = (operationsByType[m.operation] || 0) + 1;
    });

    return {
      totalOperations: this.metrics.length,
      successfulOperations: successful.length,
      failedOperations: failed.length,
      averageDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
      medianDuration: durations.length > 0 ? durations[Math.floor(durations.length / 2)] : 0,
      p95Duration: durations.length > 0 ? durations[Math.floor(durations.length * 0.95)] : 0,
      p99Duration: durations.length > 0 ? durations[Math.floor(durations.length * 0.99)] : 0,
      operationsByType,
      errorRate: this.metrics.length > 0 ? failed.length / this.metrics.length : 0,
      webVitals: this.webVitals,
    };
  }

  /**
   * Get metrics for a specific operation
   */
  getOperationMetrics(operation: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.operation === operation);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Initialize Web Vitals monitoring
   */
  private initializeWebVitals(): void {
    if (!performanceConfig.enableWebVitals) return;

    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
              this.webVitals.fcp = entry.startTime;
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('Failed to initialize FCP observer:', error);
      }

      // Largest Contentful Paint
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.webVitals.lcp = lastEntry.startTime;
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('Failed to initialize LCP observer:', error);
      }

      // First Input Delay
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.webVitals.fid = (entry as any).processingStart - entry.startTime;
          }
        });
        observer.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('Failed to initialize FID observer:', error);
      }

      // Cumulative Layout Shift
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.webVitals.cls = clsValue;
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Failed to initialize CLS observer:', error);
      }
    }

    // Time to First Byte (simulated)
    if (performance.timing) {
      this.webVitals.ttfb = performance.timing.responseStart - performance.timing.navigationStart;
    }
  }

  /**
   * Add metric to collection
   */
  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Remove oldest metrics if we exceed the limit
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Start flush timer for periodic metric reporting
   */
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flushMetrics();
    }, this.flushInterval);
  }

  /**
   * Flush metrics to console or external service
   */
  private flushMetrics(): void {
    if (this.metrics.length === 0) return;

    const stats = this.getStats();
    console.log('📊 Performance Metrics:', stats);

    // In production, you would send metrics to an analytics service
    // this.sendMetricsToAnalytics(stats);
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export const measureOperation = performanceMonitor.measure.bind(performanceMonitor);
export const measureSyncOperation = performanceMonitor.measureSync.bind(performanceMonitor);
export const addCustomMetric = performanceMonitor.addCustomMetric.bind(performanceMonitor);

export default PerformanceMonitor;
