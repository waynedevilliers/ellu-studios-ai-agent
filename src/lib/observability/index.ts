// Main observability exports
export { langSmithMonitor, LangSmithMonitor } from './langsmith-integration';
export type { ConversationMetrics, AgentPerformance } from './langsmith-integration';

export { analyticsDashboard, AnalyticsDashboard } from './analytics-dashboard';
export type { AnalyticsData } from './analytics-dashboard';

export { performanceMonitor, PerformanceMonitor } from './performance-monitor';
export type { PerformanceMetrics, PerformanceMetricsInput, ErrorEvent } from './performance-monitor';

export { feedbackCollector, FeedbackCollector } from './feedback-collector';
export type { Feedback, FeedbackAnalytics } from './feedback-collector';

// Import the singletons for the unified manager
import { langSmithMonitor } from './langsmith-integration';
import { analyticsDashboard } from './analytics-dashboard';
import { performanceMonitor } from './performance-monitor';
import { feedbackCollector } from './feedback-collector';

// Unified observability helper functions
export class ObservabilityManager {
  /**
   * Track a complete conversation interaction
   */
  static async trackConversation(data: {
    sessionId: string;
    messageCount: number;
    tokenUsage: number;
    responseTime: number;
    agentType: 'openai' | 'gemini' | 'claude';
    userSatisfaction?: number;
    courseRecommended?: string;
    consultationBooked?: boolean;
    success?: boolean;
  }): Promise<void> {
    const {
      sessionId,
      messageCount,
      tokenUsage,
      responseTime,
      agentType,
      userSatisfaction,
      courseRecommended,
      consultationBooked = false,
      success = true,
    } = data;

    try {
      // Track in analytics dashboard
      analyticsDashboard.recordConversation({
        sessionId,
        messageCount,
        tokenUsage,
        responseTime,
        userSatisfaction,
        courseRecommended,
        consultationBooked,
        agentType,
        timestamp: new Date(),
      });

      // Track in LangSmith
      await langSmithMonitor.trackConversation({
        sessionId,
        messageCount,
        tokenUsage,
        responseTime,
        userSatisfaction,
        courseRecommended,
        consultationBooked,
      });

      // Track performance metrics
      performanceMonitor.recordMetrics({
        operation: 'conversation',
        duration: responseTime,
        success,
        metadata: {
          agentType,
          messageCount,
          tokenUsage,
        },
      });

      console.log('[Observability] Conversation tracked comprehensively');
    } catch (error) {
      console.error('[Observability] Failed to track conversation:', error);
    }
  }

  /**
   * Track an error across all systems
   */
  static async trackError(
    error: Error,
    operation: string,
    context: Record<string, unknown> = {}
  ): Promise<void> {
    try {
      // Track in analytics dashboard
      analyticsDashboard.recordError(error.message, context);

      // Track in LangSmith
      await langSmithMonitor.trackError(error, context);

      // Track in performance monitor
      performanceMonitor.recordError(error, operation, 'medium', context);

      console.error('[Observability] Error tracked comprehensively:', error.message);
    } catch (trackingError) {
      console.error('[Observability] Failed to track error:', trackingError);
    }
  }

  /**
   * Get comprehensive system health status
   */
  static getSystemHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    details: {
      performance: ReturnType<typeof performanceMonitor.getHealthStatus>;
      analytics: ReturnType<typeof analyticsDashboard.getAnalytics>;
      feedback: ReturnType<typeof feedbackCollector.getSatisfactionMetrics>;
    };
    summary: {
      totalConversations: number;
      avgResponseTime: number;
      errorRate: number;
      satisfactionRate: number;
    };
  } {
    const performance = performanceMonitor.getHealthStatus();
    const analytics = analyticsDashboard.getAnalytics(1); // Last hour
    const feedback = feedbackCollector.getSatisfactionMetrics(1);

    // Determine overall system status
    let overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (performance.status === 'critical' || feedback.satisfactionRate < 60) {
      overallStatus = 'critical';
    } else if (performance.status === 'warning' || feedback.satisfactionRate < 80) {
      overallStatus = 'warning';
    }

    return {
      status: overallStatus,
      details: {
        performance,
        analytics,
        feedback,
      },
      summary: {
        totalConversations: analytics.totalConversations,
        avgResponseTime: performance.metrics.avgResponseTime,
        errorRate: performance.metrics.errorRate,
        satisfactionRate: feedback.satisfactionRate,
      },
    };
  }

  /**
   * Perform maintenance on all observability systems
   */
  static performMaintenance(): void {
    try {
      analyticsDashboard.clearOldData(30); // Keep 30 days
      performanceMonitor.clearOldData(24); // Keep 24 hours
      feedbackCollector.clearOldFeedback(90); // Keep 90 days

      console.log('[Observability] Maintenance completed');
    } catch (error) {
      console.error('[Observability] Maintenance failed:', error);
    }
  }
}

// Re-export singleton instances (already exported above)
// Note: These are already exported from their respective modules above