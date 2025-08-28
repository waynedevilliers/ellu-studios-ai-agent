import { FeedbackCollector } from '../../../src/lib/observability/feedback-collector';

describe('FeedbackCollector', () => {
  let collector: FeedbackCollector;

  beforeEach(() => {
    collector = new FeedbackCollector();
  });

  describe('submitFeedback', () => {
    it('should submit valid feedback successfully', () => {
      const feedback = {
        sessionId: 'test-session-1',
        messageId: 'msg-1',
        rating: 5,
        feedback: 'Great course recommendation!',
        category: 'recommendation' as const,
        tags: ['helpful', 'accurate'],
      };

      const result = collector.submitFeedback(feedback);
      
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle feedback without optional fields', () => {
      const feedback = {
        sessionId: 'test-session-2',
        rating: 4,
        category: 'overall' as const,
        tags: [],
      };

      const result = collector.submitFeedback(feedback);
      
      expect(result.success).toBe(true);
    });

    it('should reject invalid rating values', () => {
      const feedback = {
        sessionId: 'test-session-3',
        rating: 6, // Invalid: should be 1-5
        category: 'overall' as const,
        tags: [],
      };

      const result = collector.submitFeedback(feedback);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject negative rating values', () => {
      const feedback = {
        sessionId: 'test-session-4',
        rating: 0, // Invalid: should be 1-5
        category: 'overall' as const,
        tags: [],
      };

      const result = collector.submitFeedback(feedback);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getFeedbackAnalytics', () => {
    beforeEach(() => {
      // Add test feedback data
      collector.submitFeedback({
        sessionId: 'session-1',
        rating: 5,
        feedback: 'Excellent service, very helpful!',
        category: 'recommendation',
        tags: ['helpful'],
      });

      collector.submitFeedback({
        sessionId: 'session-2',
        rating: 4,
        feedback: 'Good but could be faster',
        category: 'response_quality',
        tags: ['slow'],
      });

      collector.submitFeedback({
        sessionId: 'session-3',
        rating: 2,
        feedback: 'Confusing and unclear response',
        category: 'response_quality',
        tags: ['confusing'],
      });

      collector.submitFeedback({
        sessionId: 'session-4',
        rating: 5,
        category: 'overall',
        tags: [],
      });
    });

    it('should return correct analytics structure', () => {
      const analytics = collector.getFeedbackAnalytics();

      expect(analytics).toHaveProperty('totalFeedback');
      expect(analytics).toHaveProperty('averageRating');
      expect(analytics).toHaveProperty('ratingDistribution');
      expect(analytics).toHaveProperty('categoryBreakdown');
      expect(analytics).toHaveProperty('recentFeedback');
      expect(analytics).toHaveProperty('trends');
    });

    it('should calculate basic metrics correctly', () => {
      const analytics = collector.getFeedbackAnalytics();

      expect(analytics.totalFeedback).toBe(4);
      expect(analytics.averageRating).toBe(4); // (5 + 4 + 2 + 5) / 4 = 4
    });

    it('should create correct rating distribution', () => {
      const analytics = collector.getFeedbackAnalytics();
      
      expect(analytics.ratingDistribution['5']).toBe(2);
      expect(analytics.ratingDistribution['4']).toBe(1);
      expect(analytics.ratingDistribution['3']).toBe(0);
      expect(analytics.ratingDistribution['2']).toBe(1);
      expect(analytics.ratingDistribution['1']).toBe(0);
    });

    it('should break down categories correctly', () => {
      const analytics = collector.getFeedbackAnalytics();
      
      expect(analytics.categoryBreakdown['recommendation']).toEqual({
        count: 1,
        averageRating: 5,
      });
      
      expect(analytics.categoryBreakdown['response_quality']).toEqual({
        count: 2,
        averageRating: 3, // (4 + 2) / 2 = 3
      });
    });

    it('should identify improvement areas and strengths', () => {
      const analytics = collector.getFeedbackAnalytics();
      
      // Categories with rating < 3.5 should be improvement areas
      expect(analytics.trends.improvementAreas).toContain('response_quality');
      
      // Categories with rating >= 4.0 should be strengths
      expect(analytics.trends.strengths).toContain('recommendation');
      expect(analytics.trends.strengths).toContain('overall');
    });

    it('should determine sentiment correctly', () => {
      const analytics = collector.getFeedbackAnalytics();
      
      // With average rating of 4.0, should be positive
      expect(analytics.trends.sentiment).toBe('positive');
    });

    it('should handle empty data gracefully', () => {
      const emptyCollector = new FeedbackCollector();
      const analytics = emptyCollector.getFeedbackAnalytics();

      expect(analytics.totalFeedback).toBe(0);
      expect(analytics.averageRating).toBe(0);
      expect(analytics.trends.sentiment).toBe('neutral');
      expect(analytics.categoryBreakdown).toEqual({});
    });
  });

  describe('getSessionFeedback', () => {
    beforeEach(() => {
      collector.submitFeedback({
        sessionId: 'target-session',
        rating: 5,
        category: 'overall',
        tags: [],
      });

      collector.submitFeedback({
        sessionId: 'other-session',
        rating: 3,
        category: 'overall',
        tags: [],
      });

      collector.submitFeedback({
        sessionId: 'target-session',
        rating: 4,
        category: 'recommendation',
        tags: [],
      });
    });

    it('should return feedback for specific session only', () => {
      const sessionFeedback = collector.getSessionFeedback('target-session');

      expect(sessionFeedback).toHaveLength(2);
      expect(sessionFeedback.every(f => f.sessionId === 'target-session')).toBe(true);
    });

    it('should return empty array for non-existent session', () => {
      const sessionFeedback = collector.getSessionFeedback('non-existent-session');

      expect(sessionFeedback).toHaveLength(0);
    });
  });

  describe('getCategoryFeedback', () => {
    beforeEach(() => {
      collector.submitFeedback({
        sessionId: 'session-1',
        rating: 5,
        feedback: 'Great recommendations!',
        category: 'recommendation',
        tags: [],
      });

      collector.submitFeedback({
        sessionId: 'session-2',
        rating: 2,
        feedback: 'Wrong course suggested',
        category: 'recommendation',
        tags: [],
      });

      collector.submitFeedback({
        sessionId: 'session-3',
        rating: 4,
        category: 'usability',
        tags: [],
      });
    });

    it('should return category-specific feedback', () => {
      const categoryFeedback = collector.getCategoryFeedback('recommendation');

      expect(categoryFeedback.count).toBe(2);
      expect(categoryFeedback.averageRating).toBe(3.5); // (5 + 2) / 2
      expect(categoryFeedback.recentFeedback).toHaveLength(2);
    });

    it('should identify common issues in low-rated feedback', () => {
      const categoryFeedback = collector.getCategoryFeedback('recommendation');

      expect(categoryFeedback.commonIssues).toContain('wrong');
    });

    it('should handle categories with no feedback', () => {
      const categoryFeedback = collector.getCategoryFeedback('other');

      expect(categoryFeedback.count).toBe(0);
      expect(categoryFeedback.averageRating).toBe(0);
      expect(categoryFeedback.commonIssues).toHaveLength(0);
    });
  });

  describe('getSatisfactionMetrics', () => {
    beforeEach(() => {
      // Add feedback with different ratings to test NPS calculation
      [5, 5, 4, 4, 3, 2, 1].forEach((rating, index) => {
        collector.submitFeedback({
          sessionId: `session-${index}`,
          rating,
          category: 'overall',
          tags: [],
        });
      });
    });

    it('should calculate NPS correctly', () => {
      const metrics = collector.getSatisfactionMetrics();

      // Promoters: 4 (ratings 4-5), Detractors: 2 (ratings 1-2)
      // NPS = ((4 - 2) / 7) * 100 = 28.57... rounded to 29
      expect(metrics.nps).toBe(29);
    });

    it('should calculate satisfaction rate correctly', () => {
      const metrics = collector.getSatisfactionMetrics();

      // Satisfaction rate: 4 out of 7 ratings >= 4
      // (4 / 7) * 100 = 57.14... rounded to 57
      expect(metrics.satisfactionRate).toBe(57);
    });

    it('should handle no feedback gracefully', () => {
      const emptyCollector = new FeedbackCollector();
      const metrics = emptyCollector.getSatisfactionMetrics();

      expect(metrics.nps).toBe(0);
      expect(metrics.satisfactionRate).toBe(0);
      expect(metrics.responseRate).toBe(0);
      expect(metrics.trend).toBe('stable');
    });
  });

  describe('clearOldFeedback', () => {
    beforeEach(() => {
      collector.submitFeedback({
        sessionId: 'test-session',
        rating: 5,
        category: 'overall',
        tags: [],
      });
    });

    it('should clear old feedback data', () => {
      // Should have feedback before clearing
      let analytics = collector.getFeedbackAnalytics();
      expect(analytics.totalFeedback).toBe(1);

      // Clear all data (0 days old)
      collector.clearOldFeedback(0);

      // Should have no feedback after clearing
      analytics = collector.getFeedbackAnalytics();
      expect(analytics.totalFeedback).toBe(0);
    });
  });
});