// ELLU Studios AI Agent Core
// Following CLAUDE.md requirements and ReAct pattern

import { ConversationState, UserProfile, Message, CourseRecommendation } from '@/types/ellu';
import { RecommendationEngine } from '@/lib/ellu/recommendations';
import { containsPromptInjection, sanitizeInput, sanitizeOutput } from '@/lib/security/validation';

export class ELLUAgent {
  private state: ConversationState;

  constructor(sessionId: string) {
    this.state = {
      phase: 'greeting',
      userProfile: {},
      assessmentStep: 0,
      recommendations: [],
      conversationHistory: [],
      intents: []
    };
  }

  /**
   * Process user input and generate response
   * Implements ReAct pattern: Thought → Action → Observation
   */
  async processMessage(userInput: string): Promise<{ response: string; blocked?: boolean; reason?: string }> {
    try {
      // Security check
      if (containsPromptInjection(userInput)) {
        return {
          response: "I appreciate your interest, but I can only help with course recommendations and ELLU Studios information. How can I assist you with your fashion education journey?",
          blocked: true,
          reason: 'security violation'
        };
      }

      // Sanitize input
      const cleanInput = sanitizeInput(userInput);
      
      // Handle very long inputs gracefully
      if (cleanInput.length > 2000) {
        return {
          response: "I notice your message is quite long. I'm having trouble processing very lengthy requests. Could you please ask your question in a more concise way? I'm here to help with course recommendations and information about ELLU Studios!",
          blocked: false,
          reason: 'message too long'
        };
      }
      
      // Add to conversation history
      this.addMessage('user', cleanInput);

      // Generate response based on current phase
      const response = await this.generateResponse(cleanInput);
      
      // Sanitize and add response to history
      const cleanResponse = sanitizeOutput(response);
      this.addMessage('agent', cleanResponse);

      return { response: cleanResponse };
      
    } catch (error) {
      console.error('Agent processing error:', error);
      return {
        response: "I apologize, but I'm having trouble processing your request right now. Could you please try rephrasing your question about our courses?",
        blocked: false,
        reason: 'processing error'
      };
    }
  }

  /**
   * Generate response based on conversation phase and user input
   */
  private async generateResponse(userInput: string): Promise<string> {
    // Detect intent first - this overrides phase-based flow for direct requests
    const intents = this.detectIntent(userInput);
    this.state.intents.push(...intents);

    // Handle direct intents regardless of current phase
    if (intents.includes('compare')) {
      return this.handleCourseComparison(userInput);
    }
    
    if (intents.includes('schedule')) {
      this.state.phase = 'scheduling';
      return this.handleScheduling(userInput);
    }
    
    if (intents.includes('email')) {
      return this.handleEmailCapture(userInput);
    }

    // Otherwise follow phase-based flow
    switch (this.state.phase) {
      case 'greeting':
        return this.handleGreeting(userInput);
      
      case 'assessment':
        return this.handleAssessment(userInput);
      
      case 'recommendation':
        return this.handleRecommendation(userInput);
      
      case 'scheduling':
        return this.handleScheduling(userInput);
      
      case 'followup':
        return this.handleFollowup(userInput);
      
      default:
        return this.handleGreeting(userInput);
    }
  }

  /**
   * Handle greeting phase - welcome and initial engagement
   */
  private handleGreeting(userInput: string): string {
    if (this.state.conversationHistory.length === 1) {
      // First user message
      this.state.phase = 'assessment';
      this.state.assessmentStep = 1;
      
      return `Willkommen bei ELLU Studios! I'm delighted you're interested in pattern making and fashion design.

To recommend the perfect learning journey for you, I'd love to learn about your background and goals. 

First, could you tell me about your current experience with sewing and pattern making? Are you a complete beginner, or do you have some experience already?`;
    }

    // Follow-up greeting responses
    this.state.phase = 'assessment';
    return "Thank you for your interest in ELLU Studios! Let me help you find the perfect course. What's your current experience level with sewing or pattern making?";
  }

  /**
   * Handle assessment phase - gather user profile information
   */
  private handleAssessment(userInput: string): string {
    // Extract information from user input
    this.extractUserProfile(userInput);

    switch (this.state.assessmentStep) {
      case 1:
        // Experience level captured, ask about goals
        this.state.assessmentStep = 2;
        return `That's wonderful! Now, what's bringing you to fashion design? Are you thinking about this as a creative hobby, considering a career change, interested in starting your own fashion business, or perhaps drawn to sustainable fashion?`;

      case 2:
        // Goals captured, ask about time commitment and style preference
        this.state.assessmentStep = 3;
        return `Excellent! One more question to give you the best recommendations: Do you prefer learning through precise, mathematical approaches (like German engineering precision) or more intuitive, creative methods (like Parisian atelier techniques)? Or are you open to both?`;

      case 3:
        // Assessment complete, generate recommendations
        this.state.phase = 'recommendation';
        return this.generateRecommendations();

      default:
        this.state.phase = 'recommendation';
        return this.generateRecommendations();
    }
  }

  /**
   * Handle recommendation phase - present courses and journey
   */
  private handleRecommendation(userInput: string): string {
    const intent = this.detectIntent(userInput);

    if (intent.includes('compare')) {
      return this.handleCourseComparison(userInput);
    }

    if (intent.includes('schedule') || intent.includes('consultation')) {
      this.state.phase = 'scheduling';
      return this.handleScheduling(userInput);
    }

    if (intent.includes('email') || intent.includes('information')) {
      return this.handleEmailCapture(userInput);
    }

    // Provide additional course information or clarification
    return `I'm happy to provide more details about any of these courses or help you compare different options. 

You can ask me things like:
- "Tell me more about the Classical Pattern Making course"
- "What's the difference between construction and draping?"
- "Can you compare the beginner and digital journeys?"

Or if you're ready to take the next step:
- "I'd like to schedule a consultation"
- "Can you send me more information by email?"

What would be most helpful for you?`;
  }

  /**
   * Generate course recommendations based on user profile
   */
  private generateRecommendations(): string {
    this.state.recommendations = RecommendationEngine.generateRecommendations(this.state.userProfile);
    
    if (this.state.recommendations.length === 0) {
      return "I'd love to help you find the perfect courses. Could you tell me more about your interests and goals?";
    }

    const topRecommendation = this.state.recommendations[0];
    const journey = topRecommendation.journey;

    if (!journey) {
      return "Based on your profile, I have some great course recommendations for you. Let me prepare a personalized learning plan!";
    }

    return `Based on your answers, I recommend our **${journey.name}**!

${journey.description}

**Your Learning Path (${journey.duration}):**

${journey.phases.map((phase, index) => 
  `**Phase ${phase.phase}**: ${phase.name} (${phase.duration})
   ${phase.description}`
).join('\n\n')}

**Goal**: ${journey.outcome}

This journey is perfect for you because: ${topRecommendation.reasoning}

Would you like me to:
📅 Schedule a free 30-minute consultation to discuss this path in detail?
📧 Send you comprehensive course information and pricing via email?
💬 Tell you more about any specific courses that interest you?

What sounds most helpful?`;
  }

  /**
   * Handle course comparison requests
   */
  private handleCourseComparison(userInput: string): string {
    // Simple comparison between construction and draping (most common request)
    return `Great question! Here's the key difference:

**Classical Pattern Making (Klassische Schnittkonstruktion):**
- Mathematical, precise approach
- Perfect for structured garments (suits, coats, fitted dresses)
- German engineering precision - very systematic
- Ideal if you love technical accuracy and detailed measurements

**Pattern Making through Draping (Schnittkonstruktion durch Drapieren):**
- Creative, intuitive approach  
- Perfect for flowing, artistic designs (evening wear, avant-garde pieces)
- Parisian atelier techniques - very artistic
- Ideal if you prefer hands-on creativity and organic shapes

Many of our students take both for complete mastery! Which style resonates more with your creative vision - precision or artistic flow?`;
  }

  /**
   * Handle email capture for follow-up
   */
  private handleEmailCapture(userInput: string): string {
    return `I'd be delighted to send you detailed course information and pricing!

Please share your email address, and I'll send you:
- Complete course descriptions and schedules
- Pricing information and payment options
- Learning journey roadmaps
- Success stories from our students
- Upcoming course start dates

What's the best email address to reach you?`;
  }

  /**
   * Handle consultation scheduling
   */
  private handleScheduling(userInput: string): string {
    this.state.phase = 'scheduling';
    
    return `Wonderful! I'd love to arrange a free 30-minute consultation with our pattern making experts.

During this call, we'll:
- Review your learning goals in detail
- Customize your learning journey
- Answer all your questions about courses
- Discuss scheduling and logistics
- Help you feel confident about your choice

Available consultation times this week:
- Tuesday, 2:00 PM - 2:30 PM (CET)
- Wednesday, 10:00 AM - 10:30 AM (CET)
- Friday, 4:00 PM - 4:30 PM (CET)

Which time works best for you? I'll also need your email address to send the calendar invitation.`;
  }

  /**
   * Handle follow-up questions and additional support
   */
  private handleFollowup(userInput: string): string {
    return `Thank you for your continued interest in ELLU Studios! 

I'm here to help with any additional questions about:
- Course content and what you'll learn
- Scheduling and logistics
- Pricing and payment options  
- Learning outcomes and career prospects
- Technical requirements or materials needed

What else would you like to know about your fashion education journey?`;
  }

  /**
   * Extract user profile information from input
   */
  private extractUserProfile(userInput: string): void {
    const input = userInput.toLowerCase();

    // Experience level detection
    if (input.includes('complete beginner') || input.includes('never') || input.includes('new to')) {
      this.state.userProfile.experience = 'complete-beginner';
    } else if (input.includes('some experience') || input.includes('basic') || input.includes('little bit')) {
      this.state.userProfile.experience = 'some-sewing';
    } else if (input.includes('intermediate') || input.includes('moderate')) {
      this.state.userProfile.experience = 'intermediate';
    } else if (input.includes('advanced') || input.includes('experienced')) {
      this.state.userProfile.experience = 'advanced';
    }

    // Goals detection
    const goals: UserProfile['goals'] = [];
    if (input.includes('career change') || input.includes('new career')) {
      goals.push('career-change');
    }
    if (input.includes('business') || input.includes('start my own')) {
      goals.push('start-business');
    }
    if (input.includes('hobby') || input.includes('fun') || input.includes('personal')) {
      goals.push('hobby');
    }
    if (input.includes('sustainable') || input.includes('eco') || input.includes('environment')) {
      goals.push('sustainability');
    }
    if (input.includes('digital') || input.includes('computer') || input.includes('technology')) {
      goals.push('digital-skills');
    }
    if (goals.length > 0) {
      this.state.userProfile.goals = goals;
    }

    // Style preference detection - check for mixed first, then specific
    if (input.includes('both') || input.includes('open') || input.includes('either') || 
        (input.includes('creative') && input.includes('technical'))) {
      this.state.userProfile.preferredStyle = 'mixed';
    } else if (input.includes('precise') || input.includes('technical') || input.includes('mathematical') || input.includes('systematic')) {
      this.state.userProfile.preferredStyle = 'precise-technical';
    } else if (input.includes('creative') || input.includes('intuitive') || input.includes('artistic') || input.includes('organic')) {
      this.state.userProfile.preferredStyle = 'creative-intuitive';
    }
  }

  /**
   * Detect user intent from input
   */
  private detectIntent(userInput: string): string[] {
    const input = userInput.toLowerCase();
    const intents: string[] = [];

    if (input.includes('schedule') || input.includes('book') || input.includes('appointment') || input.includes('consultation')) {
      intents.push('schedule');
    }
    if (input.includes('email') || input.includes('send me') || input.includes('information')) {
      intents.push('email');
    }
    if (input.includes('compare') || input.includes('difference') || input.includes('vs') || input.includes('versus')) {
      intents.push('compare');
    }
    if (input.includes('price') || input.includes('cost') || input.includes('fee')) {
      intents.push('pricing');
    }
    if (input.includes('when') || input.includes('start') || input.includes('available')) {
      intents.push('schedule_info');
    }

    return intents;
  }

  /**
   * Add message to conversation history
   */
  private addMessage(role: 'user' | 'agent', content: string): void {
    this.state.conversationHistory.push({
      role,
      content,
      timestamp: new Date()
    });
  }

  /**
   * Get current conversation state
   */
  public getState(): ConversationState {
    return { ...this.state };
  }

  /**
   * Update user profile
   */
  public updateProfile(updates: Partial<UserProfile>): void {
    this.state.userProfile = { ...this.state.userProfile, ...updates };
  }
}