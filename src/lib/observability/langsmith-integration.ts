import { Client } from 'langsmith';
import { z } from 'zod';

// Schema for conversation metrics
export const ConversationMetricsSchema = z.object({
  sessionId: z.string(),
  messageCount: z.number(),
  tokenUsage: z.number(),
  responseTime: z.number(),
  userSatisfaction: z.number().optional(),
  courseRecommended: z.string().optional(),
  consultationBooked: z.boolean().default(false),
  timestamp: z.date().default(() => new Date()),
});

export type ConversationMetrics = z.infer<typeof ConversationMetricsSchema>;

// Schema for agent performance metrics
export const AgentPerformanceSchema = z.object({
  agentType: z.enum(['openai', 'gemini', 'claude']),
  responseTime: z.number(),
  tokenCount: z.number(),
  errorRate: z.number(),
  successfulRecommendations: z.number(),
  timestamp: z.date().default(() => new Date()),
});

export type AgentPerformance = z.infer<typeof AgentPerformanceSchema>;

export class LangSmithMonitor {
  private client: Client | null = null;
  private isEnabled: boolean = false;

  constructor() {
    // Initialize LangSmith client if API key is available
    if (process.env.LANGCHAIN_API_KEY) {
      try {
        this.client = new Client({
          apiKey: process.env.LANGCHAIN_API_KEY,
        });
        this.isEnabled = true;
        console.log('[LangSmith] Monitoring enabled');
      } catch (error) {
        console.warn('[LangSmith] Failed to initialize:', error);
        this.isEnabled = false;
      }
    } else {
      console.log('[LangSmith] API key not found, monitoring disabled');
    }
  }

  /**
   * Track a conversation interaction
   */
  async trackConversation(metrics: ConversationMetrics): Promise<void> {
    if (!this.isEnabled || !this.client) return;

    try {
      // Validate metrics
      const validatedMetrics = ConversationMetricsSchema.parse(metrics);

      // Create a run in LangSmith
      await this.client.createRun({
        name: 'ellu-conversation',
        run_type: 'chain',
        inputs: {
          sessionId: validatedMetrics.sessionId,
          messageCount: validatedMetrics.messageCount,
        },
        outputs: {
          tokenUsage: validatedMetrics.tokenUsage,
          responseTime: validatedMetrics.responseTime,
          courseRecommended: validatedMetrics.courseRecommended,
          consultationBooked: validatedMetrics.consultationBooked,
        },
        extra: {
          userSatisfaction: validatedMetrics.userSatisfaction,
          timestamp: validatedMetrics.timestamp.toISOString(),
        },
      });

      console.log('[LangSmith] Conversation tracked:', validatedMetrics.sessionId);
    } catch (error) {
      console.error('[LangSmith] Failed to track conversation:', error);
    }
  }

  /**
   * Track agent performance metrics
   */
  async trackAgentPerformance(performance: AgentPerformance): Promise<void> {
    if (!this.isEnabled || !this.client) return;

    try {
      // Validate performance data
      const validatedPerformance = AgentPerformanceSchema.parse(performance);

      // Create a run for agent performance
      await this.client.createRun({
        name: `ellu-agent-${validatedPerformance.agentType}`,
        run_type: 'llm',
        inputs: {
          agentType: validatedPerformance.agentType,
        },
        outputs: {
          responseTime: validatedPerformance.responseTime,
          tokenCount: validatedPerformance.tokenCount,
          errorRate: validatedPerformance.errorRate,
          successfulRecommendations: validatedPerformance.successfulRecommendations,
        },
        extra: {
          timestamp: validatedPerformance.timestamp.toISOString(),
        },
      });

      console.log('[LangSmith] Agent performance tracked:', validatedPerformance.agentType);
    } catch (error) {
      console.error('[LangSmith] Failed to track agent performance:', error);
    }
  }

  /**
   * Track an error event
   */
  async trackError(error: Error, context: Record<string, unknown> = {}): Promise<void> {
    if (!this.isEnabled || !this.client) return;

    try {
      await this.client.createRun({
        name: 'ellu-error',
        run_type: 'chain',
        inputs: {
          errorMessage: error.message,
          errorStack: error.stack,
          context,
        },
        outputs: {},
        extra: {
          timestamp: new Date().toISOString(),
          errorType: error.constructor.name,
        },
      });

      console.log('[LangSmith] Error tracked:', error.message);
    } catch (trackingError) {
      console.error('[LangSmith] Failed to track error:', trackingError);
    }
  }

  /**
   * Track user feedback
   */
  async trackUserFeedback(
    sessionId: string,
    rating: number,
    feedback?: string,
    context?: Record<string, unknown>
  ): Promise<void> {
    if (!this.isEnabled || !this.client) return;

    try {
      await this.client.createRun({
        name: 'ellu-user-feedback',
        run_type: 'chain',
        inputs: {
          sessionId,
          rating,
          feedback,
          context,
        },
        outputs: {},
        extra: {
          timestamp: new Date().toISOString(),
        },
      });

      console.log('[LangSmith] User feedback tracked:', { sessionId, rating });
    } catch (error) {
      console.error('[LangSmith] Failed to track user feedback:', error);
    }
  }

  /**
   * Check if monitoring is enabled
   */
  isMonitoringEnabled(): boolean {
    return this.isEnabled;
  }
}

// Singleton instance
export const langSmithMonitor = new LangSmithMonitor();