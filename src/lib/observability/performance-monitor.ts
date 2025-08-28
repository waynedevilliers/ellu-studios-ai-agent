import { z } from 'zod';

// Schema for performance metrics
export const PerformanceMetricsSchema = z.object({
  operation: z.string(),
  duration: z.number(),
  success: z.boolean(),
  metadata: z.record(z.unknown()).optional(),
  timestamp: z.date().default(() => new Date()),
});

export type PerformanceMetrics = z.infer<typeof PerformanceMetricsSchema>;

// Input type for performance metrics (without timestamp)
export type PerformanceMetricsInput = Omit<PerformanceMetrics, 'timestamp'> & {
  timestamp?: Date;
};

// Schema for error tracking
export const ErrorEventSchema = z.object({
  error: z.string(),
  stack: z.string().optional(),
  operation: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  context: z.record(z.unknown()).optional(),
  timestamp: z.date().default(() => new Date()),
});

// Input type for error events (without timestamp)
export type ErrorEventInput = Omit<ErrorEvent, 'timestamp'> & {
  timestamp?: Date;
};

export type ErrorEvent = z.infer<typeof ErrorEventSchema>;

// Performance monitoring class
export class PerformanceMonitor {
  private performanceMetrics: PerformanceMetrics[] = [];
  private errorEvents: ErrorEvent[] = [];
  private activeOperations: Map<string, { operation: string; startTime: number; metadata?: Record<string, unknown> }> = new Map();
  private maxMetrics = 5000; // Prevent memory overflow

  constructor() {
    // Performance monitor initialized
  }

  /**
   * Start timing an operation
   */
  startOperation(operationId: string, operation: string, metadata?: Record<string, unknown>): void {
    this.activeOperations.set(operationId, {
      operation,
      startTime: performance.now(),
      metadata,
    });
  }

  /**
   * End timing an operation and record metrics
   */
  endOperation(operationId: string, success: boolean = true, additionalMetadata?: Record<string, unknown>): void {
    const activeOp = this.activeOperations.get(operationId);
    if (!activeOp) {
      console.warn(`[Performance] Operation not found: ${operationId}`);
      return;
    }

    const duration = performance.now() - activeOp.startTime;
    const metadata = { ...activeOp.metadata, ...additionalMetadata };

    const metrics: PerformanceMetricsInput = {
      operation: activeOp.operation,
      duration: Math.round(duration * 100) / 100, // Round to 2 decimal places
      success,
      metadata,
    };

    this.recordMetrics(metrics);
    this.activeOperations.delete(operationId);
  }

  /**
   * Record performance metrics directly
   */
  recordMetrics(metrics: PerformanceMetricsInput): void {
    try {
      const validatedMetrics = PerformanceMetricsSchema.parse(metrics);
      this.performanceMetrics.push(validatedMetrics);

      // Keep only recent metrics
      if (this.performanceMetrics.length > this.maxMetrics) {
        this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetrics);
      }

      if (typeof console !== 'undefined') {
        console.log(`[Performance] ${validatedMetrics.operation}: ${validatedMetrics.duration}ms (${validatedMetrics.success ? 'success' : 'failed'})`);
      }
    } catch (error) {
      console.error('[Performance] Failed to record metrics:', error);
    }
  }

  /**
   * Record an error event
   */
  recordError(error: Error, operation: string, severity: ErrorEvent['severity'] = 'medium', context?: Record<string, unknown>): void {
    try {
      const errorEvent: ErrorEventInput = {
        error: error.message,
        stack: error.stack,
        operation,
        severity,
        context,
      };

      const validatedError = ErrorEventSchema.parse(errorEvent);
      this.errorEvents.push(validatedError);

      // Keep only recent errors
      if (this.errorEvents.length > 1000) {
        this.errorEvents = this.errorEvents.slice(-1000);
      }

      if (typeof console !== 'undefined') {
        console.error(`[Performance] Error in ${operation} (${severity}):`, error.message);
      }
    } catch (validationError) {
      console.error('[Performance] Failed to record error:', validationError);
    }
  }

  /**
   * Get performance summary for a time range
   */
  getPerformanceSummary(timeRangeMinutes: number = 60): {
    totalOperations: number;
    successRate: number;
    averageDuration: number;
    slowestOperations: Array<{ operation: string; avgDuration: number; count: number }>;
    errorRate: number;
    topErrors: Array<{ error: string; count: number; severity: string }>;
  } {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - timeRangeMinutes * 60 * 1000);

    // Filter recent metrics
    const recentMetrics = this.performanceMetrics.filter(m => m.timestamp >= cutoffTime);
    const recentErrors = this.errorEvents.filter(e => e.timestamp >= cutoffTime);

    if (recentMetrics.length === 0) {
      return {
        totalOperations: 0,
        successRate: 100,
        averageDuration: 0,
        slowestOperations: [],
        errorRate: 0,
        topErrors: [],
      };
    }

    // Calculate basic metrics
    const totalOperations = recentMetrics.length;
    const successfulOperations = recentMetrics.filter(m => m.success).length;
    const successRate = Math.round((successfulOperations / totalOperations) * 10000) / 100;
    const averageDuration = recentMetrics.reduce((sum, m) => sum + m.duration, 0) / totalOperations;

    // Group operations by type and calculate averages
    const operationGroups = recentMetrics.reduce((acc, metric) => {
      if (!acc[metric.operation]) {
        acc[metric.operation] = [];
      }
      acc[metric.operation].push(metric.duration);
      return acc;
    }, {} as Record<string, number[]>);

    const slowestOperations = Object.entries(operationGroups)
      .map(([operation, durations]) => ({
        operation,
        avgDuration: Math.round((durations.reduce((sum, d) => sum + d, 0) / durations.length) * 100) / 100,
        count: durations.length,
      }))
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, 5);

    // Error analysis
    const errorRate = Math.round((recentErrors.length / totalOperations) * 10000) / 100;
    
    const errorGroups = recentErrors.reduce((acc, error) => {
      const key = error.error;
      if (!acc[key]) {
        acc[key] = { count: 0, severity: error.severity };
      }
      acc[key].count++;
      // Keep highest severity
      if (this.getSeverityWeight(error.severity) > this.getSeverityWeight(acc[key].severity)) {
        acc[key].severity = error.severity;
      }
      return acc;
    }, {} as Record<string, { count: number; severity: string }>);

    const topErrors = Object.entries(errorGroups)
      .map(([error, data]) => ({ error, count: data.count, severity: data.severity }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalOperations,
      successRate,
      averageDuration: Math.round(averageDuration * 100) / 100,
      slowestOperations,
      errorRate,
      topErrors,
    };
  }

  /**
   * Get detailed metrics for a specific operation
   */
  getOperationDetails(operation: string, timeRangeMinutes: number = 60): {
    count: number;
    successRate: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    p95Duration: number;
    recentErrors: Array<{ error: string; timestamp: Date; severity: string }>;
  } {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - timeRangeMinutes * 60 * 1000);

    const operationMetrics = this.performanceMetrics.filter(
      m => m.operation === operation && m.timestamp >= cutoffTime
    );
    const operationErrors = this.errorEvents.filter(
      e => e.operation === operation && e.timestamp >= cutoffTime
    );

    if (operationMetrics.length === 0) {
      return {
        count: 0,
        successRate: 100,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        p95Duration: 0,
        recentErrors: [],
      };
    }

    const durations = operationMetrics.map(m => m.duration).sort((a, b) => a - b);
    const successfulOps = operationMetrics.filter(m => m.success).length;

    const p95Index = Math.ceil(durations.length * 0.95) - 1;
    const p95Duration = durations[p95Index] || durations[durations.length - 1];

    return {
      count: operationMetrics.length,
      successRate: Math.round((successfulOps / operationMetrics.length) * 10000) / 100,
      avgDuration: Math.round((durations.reduce((sum, d) => sum + d, 0) / durations.length) * 100) / 100,
      minDuration: Math.round(durations[0] * 100) / 100,
      maxDuration: Math.round(durations[durations.length - 1] * 100) / 100,
      p95Duration: Math.round(p95Duration * 100) / 100,
      recentErrors: operationErrors.map(e => ({
        error: e.error,
        timestamp: e.timestamp,
        severity: e.severity,
      })),
    };
  }

  /**
   * Helper to get severity weight for comparison
   */
  private getSeverityWeight(severity: string): number {
    switch (severity) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      case 'critical': return 4;
      default: return 0;
    }
  }

  /**
   * Clear old data (maintenance function)
   */
  clearOldData(olderThanHours: number = 24): void {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - olderThanHours);

    const initialMetrics = this.performanceMetrics.length;
    const initialErrors = this.errorEvents.length;

    this.performanceMetrics = this.performanceMetrics.filter(m => m.timestamp >= cutoffTime);
    this.errorEvents = this.errorEvents.filter(e => e.timestamp >= cutoffTime);

    if (typeof console !== 'undefined') {
      console.log(`[Performance] Cleared ${initialMetrics - this.performanceMetrics.length} old metrics and ${initialErrors - this.errorEvents.length} old errors`);
    }
  }

  /**
   * Get real-time system health status
   */
  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    metrics: {
      avgResponseTime: number;
      errorRate: number;
      successRate: number;
    };
    issues: string[];
  } {
    const summary = this.getPerformanceSummary(5); // Last 5 minutes
    const issues: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    // Check response time
    if (summary.averageDuration > 5000) {
      issues.push(`High average response time: ${summary.averageDuration}ms`);
      status = 'critical';
    } else if (summary.averageDuration > 2000) {
      issues.push(`Elevated response time: ${summary.averageDuration}ms`);
      status = status === 'healthy' ? 'warning' : status;
    }

    // Check error rate
    if (summary.errorRate > 10) {
      issues.push(`High error rate: ${summary.errorRate}%`);
      status = 'critical';
    } else if (summary.errorRate > 5) {
      issues.push(`Elevated error rate: ${summary.errorRate}%`);
      status = status === 'healthy' ? 'warning' : status;
    }

    // Check success rate
    if (summary.successRate < 90) {
      issues.push(`Low success rate: ${summary.successRate}%`);
      status = 'critical';
    } else if (summary.successRate < 95) {
      issues.push(`Reduced success rate: ${summary.successRate}%`);
      status = status === 'healthy' ? 'warning' : status;
    }

    return {
      status,
      metrics: {
        avgResponseTime: summary.averageDuration,
        errorRate: summary.errorRate,
        successRate: summary.successRate,
      },
      issues,
    };
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();