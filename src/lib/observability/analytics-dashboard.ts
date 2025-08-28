import { z } from 'zod';

// Schema for analytics data
export const AnalyticsDataSchema = z.object({
  totalConversations: z.number(),
  averageResponseTime: z.number(),
  totalTokensUsed: z.number(),
  successfulRecommendations: z.number(),
  consultationsBooked: z.number(),
  userSatisfactionAverage: z.number(),
  topCourseRecommendations: z.array(z.object({
    courseName: z.string(),
    count: z.number(),
  })),
  agentPerformance: z.array(z.object({
    agentType: z.enum(['openai', 'gemini', 'claude']),
    averageResponseTime: z.number(),
    errorRate: z.number(),
    usageCount: z.number(),
  })),
  dailyMetrics: z.array(z.object({
    date: z.string(),
    conversations: z.number(),
    consultations: z.number(),
    satisfaction: z.number(),
  })),
});

export type AnalyticsData = z.infer<typeof AnalyticsDataSchema>;

// In-memory analytics storage (in production, use Redis or database)
interface ConversationRecord {
  sessionId: string;
  messageCount: number;
  tokenUsage: number;
  responseTime: number;
  userSatisfaction?: number;
  courseRecommended?: string;
  consultationBooked: boolean;
  timestamp: Date;
  agentType: 'openai' | 'gemini' | 'claude';
}

interface ErrorRecord {
  error: string;
  context: Record<string, unknown>;
  timestamp: Date;
}

export class AnalyticsDashboard {
  private conversations: ConversationRecord[] = [];
  private errors: ErrorRecord[] = [];
  private maxRecords = 10000; // Prevent memory overflow

  constructor() {
    if (typeof console !== 'undefined') {
      console.log('[Analytics] Dashboard initialized');
    }
  }

  /**
   * Record a conversation for analytics
   */
  recordConversation(data: {
    sessionId: string;
    messageCount: number;
    tokenUsage: number;
    responseTime: number;
    userSatisfaction?: number;
    courseRecommended?: string;
    consultationBooked: boolean;
    agentType: 'openai' | 'gemini' | 'claude';
    timestamp?: Date;
  }): void {
    const record: ConversationRecord = {
      ...data,
      timestamp: data.timestamp || new Date(),
    };

    this.conversations.push(record);
    
    // Keep only recent records to prevent memory issues
    if (this.conversations.length > this.maxRecords) {
      this.conversations = this.conversations.slice(-this.maxRecords);
    }

    if (typeof console !== 'undefined') {
      console.log('[Analytics] Conversation recorded:', data.sessionId);
    }
  }

  /**
   * Record an error for analytics
   */
  recordError(error: string, context: Record<string, unknown> = {}): void {
    const record: ErrorRecord = {
      error,
      context,
      timestamp: new Date(),
    };

    this.errors.push(record);
    
    // Keep only recent errors
    if (this.errors.length > 1000) {
      this.errors = this.errors.slice(-1000);
    }

    if (typeof console !== 'undefined') {
      console.log('[Analytics] Error recorded:', error);
    }
  }

  /**
   * Get comprehensive analytics data
   */
  getAnalytics(timeRangeHours = 24): AnalyticsData {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - timeRangeHours * 60 * 60 * 1000);
    
    // Filter conversations within time range
    const recentConversations = this.conversations.filter(
      conv => conv.timestamp >= cutoffTime
    );

    if (recentConversations.length === 0) {
      // Return empty analytics if no data
      return {
        totalConversations: 0,
        averageResponseTime: 0,
        totalTokensUsed: 0,
        successfulRecommendations: 0,
        consultationsBooked: 0,
        userSatisfactionAverage: 0,
        topCourseRecommendations: [],
        agentPerformance: [],
        dailyMetrics: [],
      };
    }

    // Calculate basic metrics
    const totalConversations = recentConversations.length;
    const averageResponseTime = recentConversations.reduce((sum, conv) => sum + conv.responseTime, 0) / totalConversations;
    const totalTokensUsed = recentConversations.reduce((sum, conv) => sum + conv.tokenUsage, 0);
    const successfulRecommendations = recentConversations.filter(conv => conv.courseRecommended).length;
    const consultationsBooked = recentConversations.filter(conv => conv.consultationBooked).length;
    
    // Calculate user satisfaction average
    const satisfactionRatings = recentConversations.filter(conv => conv.userSatisfaction !== undefined);
    const userSatisfactionAverage = satisfactionRatings.length > 0
      ? satisfactionRatings.reduce((sum, conv) => sum + (conv.userSatisfaction || 0), 0) / satisfactionRatings.length
      : 0;

    // Top course recommendations
    const courseRecommendations = recentConversations
      .filter(conv => conv.courseRecommended)
      .reduce((acc, conv) => {
        const course = conv.courseRecommended!;
        acc[course] = (acc[course] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topCourseRecommendations = Object.entries(courseRecommendations)
      .map(([courseName, count]) => ({ courseName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Agent performance metrics
    const agentGroups = recentConversations.reduce((acc, conv) => {
      if (!acc[conv.agentType]) {
        acc[conv.agentType] = [];
      }
      acc[conv.agentType].push(conv);
      return acc;
    }, {} as Record<string, ConversationRecord[]>);

    const agentPerformance = Object.entries(agentGroups).map(([agentType, conversations]) => ({
      agentType: agentType as 'openai' | 'gemini' | 'claude',
      averageResponseTime: conversations.reduce((sum, conv) => sum + conv.responseTime, 0) / conversations.length,
      errorRate: this.calculateErrorRateForAgent(agentType, cutoffTime),
      usageCount: conversations.length,
    }));

    // Daily metrics for the past 7 days
    const dailyMetrics = this.calculateDailyMetrics(recentConversations, 7);

    return {
      totalConversations,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      totalTokensUsed,
      successfulRecommendations,
      consultationsBooked,
      userSatisfactionAverage: Math.round(userSatisfactionAverage * 100) / 100,
      topCourseRecommendations,
      agentPerformance,
      dailyMetrics,
    };
  }

  /**
   * Calculate error rate for a specific agent
   */
  private calculateErrorRateForAgent(agentType: string, cutoffTime: Date): number {
    const recentErrors = this.errors.filter(error => 
      error.timestamp >= cutoffTime && 
      error.context.agentType === agentType
    );
    
    const agentConversations = this.conversations.filter(conv => 
      conv.timestamp >= cutoffTime && 
      conv.agentType === agentType
    );

    if (agentConversations.length === 0) return 0;
    
    return Math.round((recentErrors.length / agentConversations.length) * 10000) / 100; // Percentage with 2 decimals
  }

  /**
   * Calculate daily metrics
   */
  private calculateDailyMetrics(conversations: ConversationRecord[], days: number) {
    const metrics: Array<{
      date: string;
      conversations: number;
      consultations: number;
      satisfaction: number;
    }> = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayConversations = conversations.filter(conv =>
        conv.timestamp >= dayStart && conv.timestamp <= dayEnd
      );

      const consultations = dayConversations.filter(conv => conv.consultationBooked).length;
      
      const satisfactionRatings = dayConversations.filter(conv => conv.userSatisfaction !== undefined);
      const satisfaction = satisfactionRatings.length > 0
        ? satisfactionRatings.reduce((sum, conv) => sum + (conv.userSatisfaction || 0), 0) / satisfactionRatings.length
        : 0;

      metrics.push({
        date: dateStr,
        conversations: dayConversations.length,
        consultations,
        satisfaction: Math.round(satisfaction * 100) / 100,
      });
    }

    return metrics;
  }

  /**
   * Get error summary
   */
  getErrorSummary(timeRangeHours = 24): {
    totalErrors: number;
    errorRate: number;
    topErrors: Array<{ error: string; count: number }>;
  } {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - timeRangeHours * 60 * 60 * 1000);
    
    const recentErrors = this.errors.filter(error => error.timestamp >= cutoffTime);
    const recentConversations = this.conversations.filter(conv => conv.timestamp >= cutoffTime);
    
    const totalErrors = recentErrors.length;
    const errorRate = recentConversations.length > 0 
      ? Math.round((totalErrors / recentConversations.length) * 10000) / 100
      : 0;

    // Group errors by message
    const errorGroups = recentErrors.reduce((acc, error) => {
      acc[error.error] = (acc[error.error] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topErrors = Object.entries(errorGroups)
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalErrors,
      errorRate,
      topErrors,
    };
  }

  /**
   * Clear old data (maintenance function)
   */
  clearOldData(olderThanDays = 30): void {
    const cutoffTime = new Date();
    cutoffTime.setDate(cutoffTime.getDate() - olderThanDays);

    const initialConversations = this.conversations.length;
    const initialErrors = this.errors.length;

    this.conversations = this.conversations.filter(conv => conv.timestamp >= cutoffTime);
    this.errors = this.errors.filter(error => error.timestamp >= cutoffTime);

    if (typeof console !== 'undefined') {
      console.log(`[Analytics] Cleared ${initialConversations - this.conversations.length} old conversations and ${initialErrors - this.errors.length} old errors`);
    }
  }
}

// Singleton instance
export const analyticsDashboard = new AnalyticsDashboard();