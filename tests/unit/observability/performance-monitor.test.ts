import { PerformanceMonitor } from '../../../src/lib/observability/performance-monitor';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
  });

  describe('operation timing', () => {
    it('should track operation timing correctly', () => {
      const operationId = 'test-op-1';
      
      monitor.startOperation(operationId, 'test-operation');
      
      // Simulate some work
      const startTime = performance.now();
      while (performance.now() - startTime < 10) {
        // Wait for at least 10ms
      }
      
      monitor.endOperation(operationId, true);
      
      const summary = monitor.getPerformanceSummary(1);
      expect(summary.totalOperations).toBe(1);
      expect(summary.averageDuration).toBeGreaterThan(0);
    });

    it('should handle missing operations gracefully', () => {
      expect(() => {
        monitor.endOperation('non-existent-op', true);
      }).not.toThrow();
    });

    it('should track failed operations', () => {
      const operationId = 'test-op-2';
      
      monitor.startOperation(operationId, 'failing-operation');
      monitor.endOperation(operationId, false);
      
      const summary = monitor.getPerformanceSummary(1);
      expect(summary.successRate).toBe(0);
    });
  });

  describe('recordMetrics', () => {
    it('should record valid metrics', () => {
      const metrics = {
        operation: 'test-operation',
        duration: 1500,
        success: true,
        metadata: { test: 'data' },
      };

      expect(() => {
        monitor.recordMetrics(metrics);
      }).not.toThrow();

      const summary = monitor.getPerformanceSummary(1);
      expect(summary.totalOperations).toBe(1);
      expect(summary.averageDuration).toBe(1500);
    });

    it('should validate metrics schema', () => {
      const invalidMetrics = {
        operation: 'test',
        duration: 'invalid', // Should be number
        success: true,
      };

      // Should handle invalid metrics gracefully
      expect(() => {
        // @ts-ignore - Testing invalid input
        monitor.recordMetrics(invalidMetrics);
      }).not.toThrow();
    });
  });

  describe('recordError', () => {
    it('should record error events', () => {
      const error = new Error('Test error');
      
      monitor.recordError(error, 'test-operation', 'high', { context: 'test' });
      
      const summary = monitor.getPerformanceSummary(1);
      expect(summary.topErrors).toHaveLength(1);
      expect(summary.topErrors[0].error).toBe('Test error');
      expect(summary.topErrors[0].severity).toBe('high');
    });

    it('should handle errors without context', () => {
      const error = new Error('Simple error');
      
      expect(() => {
        monitor.recordError(error, 'test-operation');
      }).not.toThrow();
    });
  });

  describe('getPerformanceSummary', () => {
    beforeEach(() => {
      // Add test data
      monitor.recordMetrics({
        operation: 'fast-op',
        duration: 500,
        success: true,
      });

      monitor.recordMetrics({
        operation: 'slow-op',
        duration: 2000,
        success: true,
      });

      monitor.recordMetrics({
        operation: 'failed-op',
        duration: 1000,
        success: false,
      });

      monitor.recordError(
        new Error('Connection timeout'),
        'network-op',
        'high'
      );
    });

    it('should calculate summary metrics correctly', () => {
      const summary = monitor.getPerformanceSummary(1);

      expect(summary.totalOperations).toBe(3);
      expect(summary.successRate).toBeCloseTo(66.67, 1); // 2/3 * 100
      expect(summary.averageDuration).toBeCloseTo(1166.67, 1); // (500 + 2000 + 1000) / 3
      expect(summary.errorRate).toBeCloseTo(33.33, 1); // 1 error / 3 operations * 100
    });

    it('should identify slowest operations', () => {
      const summary = monitor.getPerformanceSummary(1);

      expect(summary.slowestOperations).toHaveLength(3);
      expect(summary.slowestOperations[0].operation).toBe('slow-op');
      expect(summary.slowestOperations[0].avgDuration).toBe(2000);
    });

    it('should list top errors', () => {
      const summary = monitor.getPerformanceSummary(1);

      expect(summary.topErrors).toHaveLength(1);
      expect(summary.topErrors[0].error).toBe('Connection timeout');
      expect(summary.topErrors[0].count).toBe(1);
      expect(summary.topErrors[0].severity).toBe('high');
    });

    it('should handle empty data', () => {
      const emptyMonitor = new PerformanceMonitor();
      const summary = emptyMonitor.getPerformanceSummary(1);

      expect(summary.totalOperations).toBe(0);
      expect(summary.successRate).toBe(100);
      expect(summary.averageDuration).toBe(0);
      expect(summary.slowestOperations).toHaveLength(0);
      expect(summary.topErrors).toHaveLength(0);
    });
  });

  describe('getOperationDetails', () => {
    beforeEach(() => {
      // Add multiple instances of the same operation
      const durations = [100, 200, 300, 400, 500];
      durations.forEach((duration, index) => {
        monitor.recordMetrics({
          operation: 'test-operation',
          duration,
          success: index < 4, // Last one fails
        });
      });

      monitor.recordError(
        new Error('Operation failed'),
        'test-operation',
        'medium'
      );
    });

    it('should provide detailed operation metrics', () => {
      const details = monitor.getOperationDetails('test-operation', 60);

      expect(details.count).toBe(5);
      expect(details.successRate).toBe(80); // 4/5 * 100
      expect(details.avgDuration).toBe(300); // (100+200+300+400+500)/5
      expect(details.minDuration).toBe(100);
      expect(details.maxDuration).toBe(500);
      expect(details.p95Duration).toBe(500); // 95th percentile
      expect(details.recentErrors).toHaveLength(1);
    });

    it('should handle operations with no data', () => {
      const details = monitor.getOperationDetails('non-existent-op', 60);

      expect(details.count).toBe(0);
      expect(details.successRate).toBe(100);
      expect(details.avgDuration).toBe(0);
      expect(details.recentErrors).toHaveLength(0);
    });
  });

  describe('getHealthStatus', () => {
    it('should return healthy status for good metrics', () => {
      monitor.recordMetrics({
        operation: 'good-op',
        duration: 1000, // Under 2s threshold
        success: true,
      });

      const health = monitor.getHealthStatus();

      expect(health.status).toBe('healthy');
      expect(health.issues).toHaveLength(0);
    });

    it('should return warning status for elevated response times', () => {
      monitor.recordMetrics({
        operation: 'slow-op',
        duration: 3000, // Between 2s and 5s
        success: true,
      });

      const health = monitor.getHealthStatus();

      expect(health.status).toBe('warning');
      expect(health.issues.length).toBeGreaterThan(0);
      expect(health.issues[0]).toContain('response time');
    });

    it('should return critical status for very slow operations', () => {
      monitor.recordMetrics({
        operation: 'very-slow-op',
        duration: 6000, // Over 5s threshold
        success: true,
      });

      const health = monitor.getHealthStatus();

      expect(health.status).toBe('critical');
      expect(health.issues.length).toBeGreaterThan(0);
    });

    it('should return critical status for high error rates', () => {
      // Add mostly failing operations
      for (let i = 0; i < 10; i++) {
        monitor.recordMetrics({
          operation: 'failing-op',
          duration: 1000,
          success: false, // All operations fail
        });
      }

      const health = monitor.getHealthStatus();

      expect(health.status).toBe('critical');
      expect(health.issues.some(issue => issue.includes('success rate'))).toBe(true);
    });
  });

  describe('clearOldData', () => {
    beforeEach(() => {
      monitor.recordMetrics({
        operation: 'old-operation',
        duration: 1000,
        success: true,
      });

      monitor.recordError(
        new Error('Old error'),
        'old-operation',
        'low'
      );
    });

    it('should clear old performance data', () => {
      // Should have data before clearing
      let summary = monitor.getPerformanceSummary(1);
      expect(summary.totalOperations).toBe(1);

      // Clear all data (0 hours old)
      monitor.clearOldData(0);

      // Should have no data after clearing
      summary = monitor.getPerformanceSummary(1);
      expect(summary.totalOperations).toBe(0);
      expect(summary.topErrors).toHaveLength(0);
    });
  });
});