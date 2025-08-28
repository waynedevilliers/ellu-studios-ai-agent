import { z } from 'zod';

// Schema for user feedback
export const FeedbackSchema = z.object({
  sessionId: z.string(),
  messageId: z.string().optional(),
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
  category: z.enum(['recommendation', 'response_quality', 'usability', 'overall', 'other']),
  tags: z.array(z.string()).optional().default([]),
  timestamp: z.date().default(() => new Date()),
});

// Input type for feedback (without timestamp)
export type FeedbackInput = Omit<Feedback, 'timestamp'> & {
  timestamp?: Date;
};

export type Feedback = z.infer<typeof FeedbackSchema>;

// Schema for feedback analytics
export const FeedbackAnalyticsSchema = z.object({
  totalFeedback: z.number(),
  averageRating: z.number(),
  ratingDistribution: z.record(z.number()),
  categoryBreakdown: z.record(z.object({
    count: z.number(),
    averageRating: z.number(),
  })),
  recentFeedback: z.array(FeedbackSchema),
  trends: z.object({
    improvementAreas: z.array(z.string()),
    strengths: z.array(z.string()),
    sentiment: z.enum(['positive', 'neutral', 'negative']),
  }),
});

export type FeedbackAnalytics = z.infer<typeof FeedbackAnalyticsSchema>;

// User feedback collection and analysis
export class FeedbackCollector {
  private feedback: Feedback[] = [];
  private maxFeedback = 10000; // Prevent memory overflow

  constructor() {
    // Constructor initialized
  }

  /**
   * Submit user feedback
   */
  submitFeedback(feedbackData: FeedbackInput): { success: boolean; error?: string } {
    try {
      const feedback = FeedbackSchema.parse({
        ...feedbackData,
        timestamp: new Date(),
      });

      this.feedback.push(feedback);

      // Keep only recent feedback
      if (this.feedback.length > this.maxFeedback) {
        this.feedback = this.feedback.slice(-this.maxFeedback);
      }

      if (typeof console !== 'undefined') {
        console.log(`[Feedback] Submitted: ${feedback.category} rating ${feedback.rating} for session ${feedback.sessionId}`);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid feedback data';
      if (typeof console !== 'undefined') {
        console.error('[Feedback] Submission failed:', errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Get feedback analytics for a time range
   */
  getFeedbackAnalytics(timeRangeHours: number = 24): FeedbackAnalytics {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - timeRangeHours * 60 * 60 * 1000);

    const recentFeedback = this.feedback.filter(f => f.timestamp >= cutoffTime);

    if (recentFeedback.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
        categoryBreakdown: {},
        recentFeedback: [],
        trends: {
          improvementAreas: [],
          strengths: [],
          sentiment: 'neutral',
        },
      };
    }

    // Calculate basic metrics
    const totalFeedback = recentFeedback.length;
    const averageRating = recentFeedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback;

    // Rating distribution
    const ratingDistribution = recentFeedback.reduce((acc, f) => {
      const key = f.rating.toString() as keyof typeof acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 } as Record<string, number>);

    // Category breakdown
    const categoryGroups = recentFeedback.reduce((acc, f) => {
      if (!acc[f.category]) {
        acc[f.category] = [];
      }
      acc[f.category].push(f.rating);
      return acc;
    }, {} as Record<string, number[]>);

    const categoryBreakdown = Object.entries(categoryGroups).reduce((acc, [category, ratings]) => {
      acc[category] = {
        count: ratings.length,
        averageRating: Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 100) / 100,
      };
      return acc;
    }, {} as Record<string, { count: number; averageRating: number }>);

    // Analyze trends
    const trends = this.analyzeTrends(recentFeedback, categoryBreakdown);

    // Get recent feedback (last 10)
    const sortedRecentFeedback = recentFeedback
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalFeedback,
      averageRating: Math.round(averageRating * 100) / 100,
      ratingDistribution,
      categoryBreakdown,
      recentFeedback: sortedRecentFeedback,
      trends,
    };
  }

  /**
   * Analyze feedback trends and identify improvement areas
   */
  private analyzeTrends(
    feedback: Feedback[],
    categoryBreakdown: Record<string, { count: number; averageRating: number }>
  ): FeedbackAnalytics['trends'] {
    const improvementAreas: string[] = [];
    const strengths: string[] = [];

    // Identify categories that need improvement (rating < 3.5)
    Object.entries(categoryBreakdown).forEach(([category, data]) => {
      if (data.averageRating < 3.5) {
        improvementAreas.push(category);
      } else if (data.averageRating >= 4.0) {
        strengths.push(category);
      }
    });

    // Analyze common feedback themes from text
    const textFeedback = feedback
      .filter(f => f.feedback && f.feedback.trim().length > 0)
      .map(f => f.feedback!.toLowerCase());

    // Simple keyword analysis for improvement areas
    const negativeKeywords = ['slow', 'confusing', 'unclear', 'wrong', 'bad', 'poor', 'difficult', 'hard'];
    const positiveKeywords = ['fast', 'helpful', 'clear', 'good', 'great', 'excellent', 'easy', 'useful'];

    const negativeCount = textFeedback.reduce((count, text) => {
      return count + negativeKeywords.reduce((keywordCount, keyword) => {
        return keywordCount + (text.includes(keyword) ? 1 : 0);
      }, 0);
    }, 0);

    const positiveCount = textFeedback.reduce((count, text) => {
      return count + positiveKeywords.reduce((keywordCount, keyword) => {
        return keywordCount + (text.includes(keyword) ? 1 : 0);
      }, 0);
    }, 0);

    // Determine overall sentiment
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    const overallRating = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;
    
    if (overallRating >= 4.0 || positiveCount > negativeCount * 2) {
      sentiment = 'positive';
    } else if (overallRating <= 2.5 || negativeCount > positiveCount * 2) {
      sentiment = 'negative';
    }

    // Add specific improvement suggestions based on common issues
    if (textFeedback.some(text => text.includes('slow'))) {
      improvementAreas.push('response_speed');
    }
    if (textFeedback.some(text => text.includes('confusing') || text.includes('unclear'))) {
      improvementAreas.push('clarity');
    }
    if (textFeedback.some(text => text.includes('wrong') || text.includes('incorrect'))) {
      improvementAreas.push('accuracy');
    }

    return {
      improvementAreas: [...new Set(improvementAreas)], // Remove duplicates
      strengths: [...new Set(strengths)],
      sentiment,
    };
  }

  /**
   * Get feedback for a specific session
   */
  getSessionFeedback(sessionId: string): Feedback[] {
    return this.feedback.filter(f => f.sessionId === sessionId);
  }

  /**
   * Get feedback summary for a specific category
   */
  getCategoryFeedback(category: Feedback['category'], timeRangeHours: number = 24): {
    count: number;
    averageRating: number;
    recentFeedback: Feedback[];
    commonIssues: string[];
  } {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - timeRangeHours * 60 * 60 * 1000);

    const categoryFeedback = this.feedback.filter(
      f => f.category === category && f.timestamp >= cutoffTime
    );

    if (categoryFeedback.length === 0) {
      return {
        count: 0,
        averageRating: 0,
        recentFeedback: [],
        commonIssues: [],
      };
    }

    const averageRating = categoryFeedback.reduce((sum, f) => sum + f.rating, 0) / categoryFeedback.length;

    // Extract common issues from low-rated feedback (rating <= 2)
    const lowRatedFeedback = categoryFeedback.filter(f => f.rating <= 2);
    const commonIssues: string[] = [];

    if (lowRatedFeedback.length > 0) {
      const feedbackTexts = lowRatedFeedback
        .map(f => f.feedback)
        .filter(Boolean)
        .map(text => text!.toLowerCase());

      const issueKeywords = ['slow', 'wrong', 'confusing', 'unclear', 'difficult', 'unhelpful'];
      
      issueKeywords.forEach(keyword => {
        if (feedbackTexts.some(text => text.includes(keyword))) {
          commonIssues.push(keyword);
        }
      });
    }

    return {
      count: categoryFeedback.length,
      averageRating: Math.round(averageRating * 100) / 100,
      recentFeedback: categoryFeedback.slice(-5), // Last 5 feedback items
      commonIssues,
    };
  }

  /**
   * Export feedback data for analysis
   */
  exportFeedback(timeRangeHours: number = 24): {
    metadata: {
      exportDate: string;
      timeRange: string;
      totalFeedback: number;
    };
    data: Feedback[];
  } {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - timeRangeHours * 60 * 60 * 1000);

    const exportData = this.feedback.filter(f => f.timestamp >= cutoffTime);

    return {
      metadata: {
        exportDate: now.toISOString(),
        timeRange: `${timeRangeHours} hours`,
        totalFeedback: exportData.length,
      },
      data: exportData,
    };
  }

  /**
   * Clear old feedback data (maintenance function)
   */
  clearOldFeedback(olderThanDays: number = 90): void {
    const cutoffTime = new Date();
    cutoffTime.setDate(cutoffTime.getDate() - olderThanDays);

    const initialCount = this.feedback.length;
    this.feedback = this.feedback.filter(f => f.timestamp >= cutoffTime);

    if (typeof console !== 'undefined') {
      console.log(`[Feedback] Cleared ${initialCount - this.feedback.length} old feedback entries`);
    }
  }

  /**
   * Get quick satisfaction metrics
   */
  getSatisfactionMetrics(timeRangeHours: number = 24): {
    nps: number; // Net Promoter Score (promoters - detractors)
    satisfactionRate: number; // % of ratings >= 4
    responseRate: number; // % of sessions with feedback
    trend: 'improving' | 'stable' | 'declining';
  } {
    const now = new Date();
    const recentCutoff = new Date(now.getTime() - timeRangeHours * 60 * 60 * 1000);
    const previousCutoff = new Date(now.getTime() - timeRangeHours * 2 * 60 * 60 * 1000);

    const recentFeedback = this.feedback.filter(f => f.timestamp >= recentCutoff);
    const previousFeedback = this.feedback.filter(f => f.timestamp >= previousCutoff && f.timestamp < recentCutoff);

    if (recentFeedback.length === 0) {
      return {
        nps: 0,
        satisfactionRate: 0,
        responseRate: 0,
        trend: 'stable',
      };
    }

    // Calculate NPS (treating 5-4 as promoters, 3 as passive, 2-1 as detractors)
    const promoters = recentFeedback.filter(f => f.rating >= 4).length;
    const detractors = recentFeedback.filter(f => f.rating <= 2).length;
    const nps = Math.round(((promoters - detractors) / recentFeedback.length) * 100);

    // Calculate satisfaction rate (% of ratings >= 4)
    const satisfactionRate = Math.round((promoters / recentFeedback.length) * 100);

    // Calculate response rate (assuming unique sessions)
    const uniqueSessions = new Set(recentFeedback.map(f => f.sessionId)).size;
    const responseRate = Math.round((uniqueSessions / Math.max(recentFeedback.length, uniqueSessions)) * 100);

    // Determine trend
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (previousFeedback.length > 0) {
      const previousAvgRating = previousFeedback.reduce((sum, f) => sum + f.rating, 0) / previousFeedback.length;
      const recentAvgRating = recentFeedback.reduce((sum, f) => sum + f.rating, 0) / recentFeedback.length;
      
      if (recentAvgRating > previousAvgRating + 0.2) {
        trend = 'improving';
      } else if (recentAvgRating < previousAvgRating - 0.2) {
        trend = 'declining';
      }
    }

    return {
      nps,
      satisfactionRate,
      responseRate,
      trend,
    };
  }
}

// Singleton instance
export const feedbackCollector = new FeedbackCollector();