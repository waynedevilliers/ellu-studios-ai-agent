// Advanced ELLU Studios AI Agent - Pure LLM Reasoning Approach
// No hardcoded responses, relies on advanced prompting techniques

import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BufferWindowMemory } from "langchain/memory";
import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { AgentExecutor } from "langchain/agents";
import { createOpenAIToolsAgent } from "langchain/agents";

import { UserProfile, ConversationState } from '@/types/ellu';
import { RecommendationEngine } from '@/lib/ellu/recommendations';
import { COURSES, COURSE_PACKAGES } from '@/lib/ellu/courses';
import { containsPromptInjection, sanitizeInput, sanitizeOutput } from '@/lib/security/validation';
import { ADVANCED_SYSTEM_PROMPT } from './advanced-prompt';
import { LLMSettings, MultiLLMManager } from '@/lib/llm/multi-llm-agent';

// Enhanced Function Tools with better descriptions
class GetCourseRecommendationsTool extends StructuredTool {
  name = "get_course_recommendations";
  description = "Generate personalized course recommendations based on user profile. Use when you have enough information about user's experience, goals, and preferences.";
  schema = z.object({
    userProfile: z.object({
      experience: z.enum(['complete-beginner', 'some-sewing', 'intermediate', 'advanced']).optional(),
      goals: z.array(z.enum(['hobby', 'career-change', 'start-business', 'sustainability', 'digital-skills'])).optional(),
      preferredStyle: z.enum(['precise-technical', 'creative-intuitive', 'mixed']).optional(),
    }),
  });

  async _call(input: z.infer<typeof this.schema>) {
    const recommendations = RecommendationEngine.generateRecommendations(input.userProfile);
    
    return JSON.stringify({
      recommendations: recommendations.slice(0, 3).map(rec => ({
        course: rec.course.name,
        journey: rec.journey?.name,
        matchScore: rec.matchScore,
        reasoning: rec.reasoning,
        duration: rec.course.duration,
        level: rec.course.level,
        pricing: rec.course.pricing.amount,
        description: rec.course.description
      })),
      message: "Use these recommendations to craft a personalized response explaining why each course fits the user's needs."
    });
  }
}

class CompareCoursesTool extends StructuredTool {
  name = "compare_courses";
  description = "Compare two specific courses in detail. Use when user asks about differences between courses or learning approaches.";
  schema = z.object({
    course1: z.string().describe("First course identifier (e.g., 'pattern-construction-basics')"),
    course2: z.string().describe("Second course identifier (e.g., 'draping-fundamentals')"),
  });

  async _call(input: z.infer<typeof this.schema>) {
    const comparison = RecommendationEngine.compareCourses(input.course1, input.course2);
    return comparison || "Detailed comparison of learning approaches, techniques, outcomes, and ideal student profiles.";
  }
}

class ScheduleConsultationTool extends StructuredTool {
  name = "schedule_consultation";
  description = "Schedule a consultation meeting. Use when user expresses interest in booking a meeting or consultation.";
  schema = z.object({
    email: z.string().email().describe("User's email address"),
    preferredTime: z.string().describe("User's preferred consultation time"),
    interests: z.string().optional().describe("Specific areas of interest to discuss")
  });

  async _call(input: z.infer<typeof this.schema>) {
    return JSON.stringify({
      status: "consultation_requested",
      email: input.email,
      preferredTime: input.preferredTime,
      interests: input.interests,
      message: "Consultation request processed. Confirm details and next steps with the user."
    });
  }
}

export class AdvancedELLUAgent {
  private llm!: BaseChatModel;
  private memory!: BufferWindowMemory;
  private agentExecutor: AgentExecutor | null = null;
  private state: ConversationState;
  private initialized: boolean = false;
  private currentSettings: LLMSettings;

  constructor(llmSettings?: Partial<LLMSettings>) {
    this.currentSettings = {
      provider: 'openai',
      temperature: 0.7,
      maxTokens: 500,
      topP: 1.0,
      topK: 40,
      ...llmSettings
    };

    this.state = {
      phase: 'greeting',
      userProfile: {},
      assessmentStep: 0,
      recommendations: [],
      conversationHistory: [],
      intents: []
    };

    this.initializeComponents();
  }

  private initializeComponents() {
    try {
      // Initialize LLM based on current settings
      this.llm = MultiLLMManager.createLLM(this.currentSettings);

      // Initialize memory for conversation context
      this.memory = new BufferWindowMemory({
        k: 10, // Keep last 10 interactions
        memoryKey: "chat_history",
      });

      // Initialize agent
      this.initializeAgent().catch(error => {
        console.warn('Advanced agent initialization failed:', error);
        this.initialized = false;
      });
    } catch (error) {
      console.warn('LangChain initialization failed:', error);
    }
  }

  private async initializeAgent() {
    const tools = [
      new GetCourseRecommendationsTool(),
      new CompareCoursesTool(),
      new ScheduleConsultationTool(),
    ];

    // Create advanced prompt template with dynamic context injection
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", this.buildDynamicSystemPrompt()],
      ["placeholder", "{chat_history}"],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    const agent = await createOpenAIToolsAgent({
      llm: this.llm,
      tools,
      prompt: promptTemplate,
    });

    this.agentExecutor = new AgentExecutor({
      agent,
      tools,
      verbose: process.env.NODE_ENV === 'development',
      maxIterations: 3, // Focused reasoning
    });

    this.initialized = true;
  }

  private buildDynamicSystemPrompt(): string {
    // Inject dynamic context into system prompt
    const userContext = this.buildUserContext();
    const conversationContext = this.buildConversationContext();
    
    return `${ADVANCED_SYSTEM_PROMPT}

## AKTUELLER NUTZER-KONTEXT:
${userContext}

## GESPRÄCHSKONTEXT:
${conversationContext}

Nutze diesen Kontext für personalisierte, kontextbewusste Antworten.`;
  }

  private buildUserContext(): string {
    const profile = this.state.userProfile;
    if (!profile.experience && !profile.goals?.length) {
      return "Neuer Nutzer - Profil noch zu ermitteln";
    }

    return `
- Erfahrung: ${profile.experience || 'unbekannt'}
- Ziele: ${profile.goals?.join(', ') || 'noch zu ermitteln'}
- Lernstil: ${profile.preferredStyle || 'noch zu ermitteln'}
- Sprache: ${profile.preferredLanguage || 'deutsch'}`;
  }

  private buildConversationContext(): string {
    const history = this.state.conversationHistory.slice(-3); // Last 3 interactions
    if (history.length === 0) {
      return "Erstes Gespräch mit diesem Nutzer";
    }

    return `
Letzte Interaktionen:
${history.map((h, i) => `${i + 1}. ${h.role}: ${h.content.substring(0, 100)}...`).join('\n')}

Aktuelle Phase: ${this.state.phase}`;
  }

  async processMessage(userInput: string): Promise<{ 
    response: string; 
    blocked?: boolean; 
    reason?: string;
    tokensUsed?: number;
  }> {
    try {
      // Security check
      if (containsPromptInjection(userInput)) {
        return {
          response: "Ich konzentriere mich darauf, Ihnen bei der Modeausbildung zu helfen. Welche Kurse interessieren Sie?",
          blocked: true,
          reason: 'security violation'
        };
      }

      const cleanInput = sanitizeInput(userInput);
      
      // Extract user profile information
      this.extractUserProfile(cleanInput);
      
      // Add to conversation history
      this.addToHistory('user', cleanInput);

      // Ensure agent is initialized
      if (!this.initialized && !this.agentExecutor) {
        await this.initializeAgent();
      }

      let response: string;
      let tokensUsed = 0;

      if (this.agentExecutor && this.initialized) {
        try {
          // Get chat history for context
          const chatHistory = await this.memory.chatHistory.getMessages();
          
          // Use the existing agent executor directly
          const result = await this.agentExecutor.invoke({ 
            input: cleanInput,
            chat_history: chatHistory
          });
          
          response = result.output || "Ich bin hier, um Ihnen bei Ihrer Modeausbildung zu helfen. Können Sie mir mehr über Ihre Ziele erzählen?";
          
          // Estimate token usage
          tokensUsed = Math.ceil((cleanInput.length + response.length) / 4);
        } catch (error) {
          console.error('Agent execution failed:', error);
          response = "Entschuldigung, ich hatte gerade Schwierigkeiten. Können Sie Ihre Frage zur Modeausbildung bitte noch einmal stellen?";
        }
      } else {
        response = "Herzlich willkommen bei ELLU Studios! Ich bin hier, um Ihnen bei der Auswahl der perfekten Modekurse zu helfen. Erzählen Sie mir von Ihrer Erfahrung und Ihren Zielen!";
      }

      const cleanResponse = sanitizeOutput(response);
      
      // Add to memory and internal history
      await this.memory.saveContext({ input: cleanInput }, { output: cleanResponse });
      this.addToHistory('agent', cleanResponse);

      // Update conversation phase
      this.updatePhase(cleanInput, cleanResponse);

      return { 
        response: cleanResponse,
        tokensUsed
      };

    } catch (error) {
      console.error('Advanced AI Agent processing error:', error);
      return {
        response: "Entschuldigung, ich hatte ein technisches Problem. Lassen Sie uns über Ihre Modeausbildungs-Ziele sprechen!",
        blocked: false,
        reason: 'processing error'
      };
    }
  }

  private extractUserProfile(input: string): void {
    const lowerInput = input.toLowerCase();

    // Experience level detection
    if (lowerInput.includes('complete beginner') || lowerInput.includes('never') || 
        lowerInput.includes('völliger anfänger') || lowerInput.includes('kompletter anfänger') || 
        lowerInput.includes('noch nie') || lowerInput.includes('keine erfahrung')) {
      this.state.userProfile.experience = 'complete-beginner';
    } else if (lowerInput.includes('some experience') || lowerInput.includes('basic') || 
               lowerInput.includes('etwas erfahrung') || lowerInput.includes('grundlagen') || 
               lowerInput.includes('anfänger')) {
      this.state.userProfile.experience = 'some-sewing';
    }

    // Goals detection
    const goals: UserProfile['goals'] = this.state.userProfile.goals || [];
    if (lowerInput.includes('career change') || lowerInput.includes('karrierewechsel')) {
      if (!goals.includes('career-change')) goals.push('career-change');
    }
    if (lowerInput.includes('business') || lowerInput.includes('unternehmen')) {
      if (!goals.includes('start-business')) goals.push('start-business');
    }
    if (lowerInput.includes('sustainable') || lowerInput.includes('nachhaltig')) {
      if (!goals.includes('sustainability')) goals.push('sustainability');
    }
    if (lowerInput.includes('digital') || lowerInput.includes('technologie')) {
      if (!goals.includes('digital-skills')) goals.push('digital-skills');
    }
    if (goals.length > 0) this.state.userProfile.goals = goals;

    // Language preference
    if (lowerInput.includes('english') || lowerInput.includes('in english')) {
      this.state.userProfile.preferredLanguage = 'english';
    } else if (!this.state.userProfile.preferredLanguage) {
      this.state.userProfile.preferredLanguage = 'german';
    }
  }

  private updatePhase(input: string, response: string): void {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('schedule') || lowerInput.includes('consultation') || 
        lowerInput.includes('termin') || lowerInput.includes('beratung')) {
      this.state.phase = 'scheduling';
    } else if (response.includes('empfehle') || response.includes('recommend')) {
      this.state.phase = 'recommendation';
    } else if (this.state.conversationHistory.length > 2) {
      this.state.phase = 'followup';
    }
  }

  private addToHistory(role: 'user' | 'agent', content: string): void {
    this.state.conversationHistory.push({
      role,
      content,
      timestamp: new Date()
    });

    // Keep only last 20 interactions to prevent memory bloat
    if (this.state.conversationHistory.length > 20) {
      this.state.conversationHistory = this.state.conversationHistory.slice(-20);
    }
  }

  // Public methods for testing and state management
  getState(): ConversationState {
    return { ...this.state };
  }

  updateProfile(updates: Partial<UserProfile>): void {
    this.state.userProfile = { ...this.state.userProfile, ...updates };
  }
}