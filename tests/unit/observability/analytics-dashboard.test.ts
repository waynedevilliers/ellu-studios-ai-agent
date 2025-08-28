import { AnalyticsDashboard } from '../../../src/lib/observability/analytics-dashboard';

describe('AnalyticsDashboard', () => {
  let dashboard: AnalyticsDashboard;

  beforeEach(() => {
    dashboard = new AnalyticsDashboard();
  });

  describe('recordConversation', () => {
    it('should record conversation data correctly', () => {
      const conversationData = {
        sessionId: 'test-session-1',
        messageCount: 3,
        tokenUsage: 150,
        responseTime: 1500,
        userSatisfaction: 4,
        courseRecommended: 'Classical Pattern Making',
        consultationBooked: false,
        agentType: 'claude' as const,
      };

      expect(() => {
        dashboard.recordConversation(conversationData);
      }).not.toThrow();
    });

    it('should handle missing optional fields', () => {
      const conversationData = {
        sessionId: 'test-session-2',
        messageCount: 1,
        tokenUsage: 50,
        responseTime: 800,
        consultationBooked: false,
        agentType: 'openai' as const,
      };

      expect(() => {
        dashboard.recordConversation(conversationData);
      }).not.toThrow();
    });
  });

  describe('recordError', () => {
    it('should record error data correctly', () => {
      const errorMessage = 'Test error';
      const context = { sessionId: 'test-session', operation: 'test' };

      expect(() => {
        dashboard.recordError(errorMessage, context);
      }).not.toThrow();
    });
  });

  describe('getAnalytics', () => {
    beforeEach(() => {
      // Add some test data
      dashboard.recordConversation({
        sessionId: 'test-1',
        messageCount: 2,
        tokenUsage: 100,
        responseTime: 1200,
        userSatisfaction: 5,
        courseRecommended: 'Classical Pattern Making',
        consultationBooked: true,
        agentType: 'claude',
      });

      dashboard.recordConversation({
        sessionId: 'test-2',
        messageCount: 3,
        tokenUsage: 150,
        responseTime: 1800,
        userSatisfaction: 4,
        courseRecommended: 'Digital Pattern Making',
        consultationBooked: false,
        agentType: 'openai',
      });

      dashboard.recordError('Test error', { agentType: 'claude' });
    });

    it('should return correct analytics structure', () => {
      const analytics = dashboard.getAnalytics();

      expect(analytics).toHaveProperty('totalConversations');
      expect(analytics).toHaveProperty('averageResponseTime');
      expect(analytics).toHaveProperty('totalTokensUsed');
      expect(analytics).toHaveProperty('successfulRecommendations');
      expect(analytics).toHaveProperty('consultationsBooked');
      expect(analytics).toHaveProperty('userSatisfactionAverage');
      expect(analytics).toHaveProperty('topCourseRecommendations');
      expect(analytics).toHaveProperty('agentPerformance');
      expect(analytics).toHaveProperty('dailyMetrics');
    });

    it('should calculate metrics correctly', () => {
      const analytics = dashboard.getAnalytics();

      expect(analytics.totalConversations).toBe(2);
      expect(analytics.averageResponseTime).toBe(1500); // (1200 + 1800) / 2
      expect(analytics.totalTokensUsed).toBe(250); // 100 + 150
      expect(analytics.successfulRecommendations).toBe(2);
      expect(analytics.consultationsBooked).toBe(1);
      expect(analytics.userSatisfactionAverage).toBe(4.5); // (5 + 4) / 2
    });

    it('should return correct course recommendations', () => {
      const analytics = dashboard.getAnalytics();

      expect(analytics.topCourseRecommendations).toHaveLength(2);
      expect(analytics.topCourseRecommendations[0].courseName).toBe('Classical Pattern Making');
      expect(analytics.topCourseRecommendations[0].count).toBe(1);
    });

    it('should return agent performance data', () => {
      const analytics = dashboard.getAnalytics();

      expect(analytics.agentPerformance).toHaveLength(2);
      
      const claudePerformance = analytics.agentPerformance.find(a => a.agentType === 'claude');
      expect(claudePerformance).toBeDefined();
      expect(claudePerformance?.averageResponseTime).toBe(1200);
      expect(claudePerformance?.usageCount).toBe(1);
    });

    it('should handle empty data gracefully', () => {
      const emptyDashboard = new AnalyticsDashboard();
      const analytics = emptyDashboard.getAnalytics();

      expect(analytics.totalConversations).toBe(0);
      expect(analytics.averageResponseTime).toBe(0);
      expect(analytics.topCourseRecommendations).toHaveLength(0);
      expect(analytics.agentPerformance).toHaveLength(0);
    });
  });

  describe('getErrorSummary', () => {
    beforeEach(() => {
      dashboard.recordError('Connection timeout', { operation: 'llm-call' });
      dashboard.recordError('Invalid input', { operation: 'validation' });
      dashboard.recordError('Connection timeout', { operation: 'llm-call' });
      
      // Add conversations for error rate calculation
      dashboard.recordConversation({
        sessionId: 'test-1',
        messageCount: 1,
        tokenUsage: 50,
        responseTime: 1000,
        consultationBooked: false,
        agentType: 'claude',
      });
    });

    it('should return error summary correctly', () => {
      const summary = dashboard.getErrorSummary();

      expect(summary).toHaveProperty('totalErrors');
      expect(summary).toHaveProperty('errorRate');
      expect(summary).toHaveProperty('topErrors');
      expect(summary.totalErrors).toBe(3);
      expect(summary.topErrors).toHaveLength(2);
    });

    it('should group errors correctly', () => {
      const summary = dashboard.getErrorSummary();
      
      const timeoutError = summary.topErrors.find(e => e.error === 'Connection timeout');
      expect(timeoutError).toBeDefined();
      expect(timeoutError?.count).toBe(2);
    });
  });

  describe('clearOldData', () => {
    beforeEach(() => {
      dashboard.recordConversation({
        sessionId: 'test-old',
        messageCount: 1,
        tokenUsage: 50,
        responseTime: 1000,
        consultationBooked: false,
        agentType: 'claude',
      });
      
      dashboard.recordError('Old error', {});
    });

    it('should clear old data correctly', () => {
      // Should have data before clearing
      let analytics = dashboard.getAnalytics();
      expect(analytics.totalConversations).toBe(1);

      // Clear data older than 0 days (everything)
      dashboard.clearOldData(0);

      // Should have no data after clearing
      analytics = dashboard.getAnalytics();
      expect(analytics.totalConversations).toBe(0);

      const errorSummary = dashboard.getErrorSummary();
      expect(errorSummary.totalErrors).toBe(0);
    });
  });
});