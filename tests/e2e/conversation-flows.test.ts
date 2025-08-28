// E2E Tests for Complete Conversation Flows
// Testing realistic user journeys through the advanced agent

import { AdvancedELLUAgent } from '@/lib/agent/advanced-agent';

// Mock HTTP requests for e2e testing
jest.mock('@langchain/openai', () => ({
  ChatOpenAI: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockResolvedValue({
      content: 'Herzlich willkommen bei ELLU Studios! Ich freue mich, Ihnen bei der Auswahl der perfekten Modekurse zu helfen.'
    })
  }))
}));

jest.mock('langchain/agents', () => ({
  AgentExecutor: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockImplementation(({ input }) => {
      // Simulate realistic agent responses based on input
      if (input.includes('Anfänger') && input.includes('Karrierewechsel')) {
        return Promise.resolve({
          output: 'Perfekt! Für Ihren Karrierewechsel als Anfänger empfehle ich unsere Beginner Journey. Diese bietet strukturierte Grundlagen mit praktischen Skills, die Arbeitgeber schätzen. Interessiert Sie mehr die präzise Schnittkonstruktion oder der kreative Drapier-Ansatz?'
        });
      }
      if (input.includes('Unterschied') && input.includes('Schnittkonstruktion')) {
        return Promise.resolve({
          output: 'Ausgezeichnete Frage! Schnittkonstruktion nutzt mathematische Präzision und technische Maße, während Drapieren intuitiv mit Stoff an der Schneiderbüste arbeitet. Beide Techniken haben ihre Stärken - welcher Ansatz spricht Sie mehr an?'
        });
      }
      if (input.includes('nachhaltig')) {
        return Promise.resolve({
          output: 'Nachhaltigkeit ist die Zukunft der Mode! Unsere Sustainable Journey deckt Zero-Waste-Schnittkonstruktion, umweltfreundliche Materialien und ethische Produktionsmethoden ab. Was interessiert Sie am meisten?'
        });
      }
      return Promise.resolve({
        output: 'Vielen Dank für Ihre Nachricht! Wie kann ich Ihnen bei Ihrer Modeausbildung helfen?'
      });
    })
  })),
  createOpenAIToolsAgent: jest.fn().mockResolvedValue({})
}));

describe('E2E Conversation Flow Tests', () => {
  let agent: AdvancedELLUAgent;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-key';
    agent = new AdvancedELLUAgent();
  });

  describe('Career Changer Journey', () => {
    test('complete career changer conversation flow', async () => {
      // Step 1: Initial greeting
      const greeting = await agent.processMessage('Hallo');
      expect(greeting.response).toBeTruthy();
      expect(greeting.blocked).toBeFalsy();

      // Step 2: Express career change interest
      const careerChange = await agent.processMessage('Ich bin kompletter Anfänger und möchte einen Karrierewechsel zur Mode');
      expect(careerChange.response).toContain('Karrierewechsel');
      expect(careerChange.response).toContain('Anfänger');

      // Verify profile extraction
      let state = agent.getState();
      expect(state.userProfile.experience).toBe('complete-beginner');
      expect(state.userProfile.goals).toContain('career-change');

      // Step 3: Ask about course differences
      const comparison = await agent.processMessage('Was ist der Unterschied zwischen Schnittkonstruktion und Drapieren?');
      expect(comparison.response).toContain('Schnittkonstruktion');
      expect(comparison.response).toContain('Drapieren');

      // Step 4: Express preference
      const preference = await agent.processMessage('Ich denke die präzise Schnittkonstruktion interessiert mich mehr');
      
      // Update profile
      state = agent.getState();
      expect(state.userProfile.preferredStyle).toBe('precise-technical');

      // Step 5: Ask for specific recommendations
      const recommendation = await agent.processMessage('Was empfehlen Sie mir konkret?');
      expect(recommendation.response).toBeTruthy();

      // Step 6: Inquire about consultation
      const consultation = await agent.processMessage('Kann ich eine Beratung buchen?');
      expect(consultation.response).toBeTruthy();

      // Verify conversation history is maintained
      const finalState = agent.getState();
      expect(finalState.conversationHistory.length).toBeGreaterThan(10); // Multiple back-and-forth
      expect(finalState.userProfile.experience).toBe('complete-beginner');
      expect(finalState.userProfile.goals).toContain('career-change');
    });
  });

  describe('Sustainability Enthusiast Journey', () => {
    test('complete sustainability-focused conversation flow', async () => {
      // Step 1: Initial contact with sustainability focus
      const initial = await agent.processMessage('Hallo, ich interessiere mich für nachhaltige Mode');
      expect(initial.response).toContain('nachhaltig');

      // Verify profile extraction
      let state = agent.getState();
      expect(state.userProfile.goals).toContain('sustainability');

      // Step 2: Ask about experience level
      const experience = await agent.processMessage('Ich habe schon etwas Näherfahrung');
      
      state = agent.getState();
      expect(state.userProfile.experience).toBe('some-sewing');

      // Step 3: Inquire about specific sustainable practices
      const practices = await agent.processMessage('Was lernt man über Zero-Waste-Techniken?');
      expect(practices.response).toBeTruthy();

      // Step 4: Ask about course structure
      const structure = await agent.processMessage('Wie ist der Kurs aufgebaut?');
      expect(structure.response).toBeTruthy();

      // Step 5: Express interest in business applications
      const business = await agent.processMessage('Ich möchte vielleicht später ein nachhaltiges Modelabel gründen');
      
      state = agent.getState();
      expect(state.userProfile.goals).toContain('start-business');

      // Verify complete profile
      const finalState = agent.getState();
      expect(finalState.userProfile.experience).toBe('some-sewing');
      expect(finalState.userProfile.goals).toContain('sustainability');
      expect(finalState.userProfile.goals).toContain('start-business');
    });
  });

  describe('Comparison Shopping Journey', () => {
    test('user comparing different learning approaches', async () => {
      // Step 1: General inquiry
      const inquiry = await agent.processMessage('Ich möchte Mode lernen aber bin unsicher welcher Ansatz');
      expect(inquiry.response).toBeTruthy();

      // Step 2: Ask about main approaches
      const approaches = await agent.processMessage('Was sind die verschiedenen Ansätze?');
      expect(approaches.response).toBeTruthy();

      // Step 3: Compare construction vs draping
      const comparison1 = await agent.processMessage('Was ist der Unterschied zwischen Schnittkonstruktion und Drapieren?');
      expect(comparison1.response).toContain('Schnittkonstruktion');
      expect(comparison1.response).toContain('Drapieren');

      // Step 4: Ask about digital approaches
      const digital = await agent.processMessage('Gibt es auch digitale Kurse?');
      expect(digital.response).toBeTruthy();

      // Step 5: Inquire about time commitment
      const time = await agent.processMessage('Wie viel Zeit brauche ich für die verschiedenen Kurse?');
      expect(time.response).toBeTruthy();

      // Step 6: Ask for personalized recommendation
      const personal = await agent.processMessage('Ich bin berufstätig und habe nur abends Zeit. Was passt zu mir?');
      
      // Should trigger recommendation function
      expect(personal.response).toBeTruthy();
    });
  });

  describe('Multilingual Journey', () => {
    test('conversation switching between German and English', async () => {
      // Start in German
      const german = await agent.processMessage('Hallo, ich interessiere mich für Kurse');
      expect(german.response).toBeTruthy();

      // Switch to English
      const english = await agent.processMessage('Can you continue in English please?');
      expect(english.response).toBeTruthy();

      // Verify language preference is updated
      let state = agent.getState();
      expect(state.userProfile.preferredLanguage).toBe('english');

      // Continue in English
      const englishContinue = await agent.processMessage('What courses do you recommend for beginners?');
      expect(englishContinue.response).toBeTruthy();

      // Switch back to German
      const backToGerman = await agent.processMessage('Können Sie auf Deutsch antworten?');
      expect(backToGerman.response).toBeTruthy();

      state = agent.getState();
      expect(state.userProfile.preferredLanguage).toBe('german');
    });
  });

  describe('Complex Multi-Goal Journey', () => {
    test('user with multiple overlapping goals', async () => {
      // Express multiple interests in one message
      const complex = await agent.processMessage(
        'Hallo, ich bin Anfänger, möchte einen Karrierewechsel machen, interessiere mich für nachhaltige Mode und denke über ein eigenes Unternehmen nach'
      );
      expect(complex.response).toBeTruthy();

      // Verify multiple goals extracted
      const state = agent.getState();
      expect(state.userProfile.experience).toBe('complete-beginner');
      expect(state.userProfile.goals).toContain('career-change');
      expect(state.userProfile.goals).toContain('sustainability');
      expect(state.userProfile.goals).toContain('start-business');

      // Ask for prioritized recommendations
      const priorities = await agent.processMessage('Was sollte ich zuerst lernen?');
      expect(priorities.response).toBeTruthy();

      // Ask about learning path
      const path = await agent.processMessage('Wie kann ich das alles kombinieren?');
      expect(path.response).toBeTruthy();

      // Inquire about timeline
      const timeline = await agent.processMessage('Wie lange dauert das insgesamt?');
      expect(timeline.response).toBeTruthy();
    });
  });

  describe('Error Recovery Journey', () => {
    test('conversation recovery after unclear inputs', async () => {
      // Start normally
      const start = await agent.processMessage('Hallo');
      expect(start.response).toBeTruthy();

      // Give unclear input
      const unclear = await agent.processMessage('äöü xyz 123');
      expect(unclear.response).toBeTruthy();
      expect(unclear.blocked).toBeFalsy();

      // Continue with clear input
      const clear = await agent.processMessage('Ich bin Anfänger und möchte lernen');
      expect(clear.response).toBeTruthy();

      // Should maintain context despite unclear input
      const state = agent.getState();
      expect(state.conversationHistory.length).toBeGreaterThan(4);
    });
  });

  describe('Consultation Booking Journey', () => {
    test('complete consultation booking flow', async () => {
      // Express interest in courses
      const interest = await agent.processMessage('Ich interessiere mich für Ihre Kurse');
      expect(interest.response).toBeTruthy();

      // Ask about consultation
      const askConsult = await agent.processMessage('Kann ich eine Beratung bekommen?');
      expect(askConsult.response).toBeTruthy();

      // Provide scheduling information
      const schedule = await agent.processMessage('Ja, ich hätte Zeit am Montag um 14:00');
      expect(schedule.response).toBeTruthy();

      // Provide contact information
      const contact = await agent.processMessage('Meine Email ist test@example.com');
      expect(contact.response).toBeTruthy();

      // Confirm details
      const confirm = await agent.processMessage('Das passt mir gut');
      expect(confirm.response).toBeTruthy();

      // Should have moved to scheduling phase
      const state = agent.getState();
      expect(['scheduling', 'recommendation', 'followup']).toContain(state.phase);
    });
  });
});