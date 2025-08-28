// Performance Tests for AdvancedELLUAgent
// Testing response times, memory usage, and scalability

import { AdvancedELLUAgent } from '@/lib/agent/advanced-agent';

// Mock LangChain for performance testing
jest.mock('@langchain/openai', () => ({
  ChatOpenAI: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ content: 'Test response' }), 50))
    )
  }))
}));

jest.mock('langchain/agents', () => ({
  AgentExecutor: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ output: 'Test response' }), 100))
    )
  })),
  createOpenAIToolsAgent: jest.fn().mockResolvedValue({})
}));

describe('AdvancedELLUAgent Performance Tests', () => {
  let agent: AdvancedELLUAgent;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-key';
    agent = new AdvancedELLUAgent();
  });

  describe('Response Time Performance', () => {
    test('should respond within acceptable time limits', async () => {
      const start = Date.now();
      const result = await agent.processMessage('Hallo, ich bin Anfänger');
      const duration = Date.now() - start;

      expect(result.response).toBeTruthy();
      expect(duration).toBeLessThan(5000); // 5 seconds max
    }, 10000);

    test('should handle multiple sequential messages efficiently', async () => {
      const messages = [
        'Hallo',
        'Ich bin Anfänger',
        'Ich möchte Karrierewechsel',
        'Was empfehlen Sie?',
        'Wie lange dauert das?'
      ];

      const start = Date.now();
      
      for (const message of messages) {
        await agent.processMessage(message);
      }
      
      const duration = Date.now() - start;
      const averageTime = duration / messages.length;

      expect(averageTime).toBeLessThan(2000); // 2 seconds average
    }, 20000);

    test('should handle concurrent requests efficiently', async () => {
      const messages = Array.from({ length: 5 }, (_, i) => `Test message ${i}`);
      
      const start = Date.now();
      const promises = messages.map(msg => agent.processMessage(msg));
      const results = await Promise.all(promises);
      const duration = Date.now() - start;

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result.response).toBeTruthy();
      });
      
      expect(duration).toBeLessThan(3000); // 3 seconds for 5 concurrent requests
    }, 10000);
  });

  describe('Memory Usage Performance', () => {
    test('should maintain reasonable memory footprint', async () => {
      // Simulate extended conversation
      const initialMemory = process.memoryUsage();
      
      for (let i = 0; i < 50; i++) {
        await agent.processMessage(`Extended conversation message ${i}`);
      }
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    }, 30000);

    test('should properly clean up conversation history', async () => {
      // Add many messages
      for (let i = 0; i < 100; i++) {
        await agent.processMessage(`Message ${i}`);
      }

      const state = agent.getState();
      
      // Should not store unlimited history
      expect(state.conversationHistory.length).toBeLessThanOrEqual(20);
    }, 15000);

    test('should handle profile updates efficiently', async () => {
      const start = Date.now();
      
      // Multiple profile updates
      for (let i = 0; i < 100; i++) {
        agent.updateProfile({
          experience: i % 2 === 0 ? 'complete-beginner' : 'advanced',
          goals: i % 2 === 0 ? ['hobby'] : ['career-change']
        });
      }
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // Should be very fast
    });
  });

  describe('Scalability Performance', () => {
    test('should handle multiple agent instances efficiently', async () => {
      const agentCount = 10;
      const agents = Array.from({ length: agentCount }, () => new AdvancedELLUAgent());
      
      const start = Date.now();
      const promises = agents.map((agent, i) => 
        agent.processMessage(`Hello from agent ${i}`)
      );
      
      const results = await Promise.all(promises);
      const duration = Date.now() - start;
      
      expect(results).toHaveLength(agentCount);
      results.forEach(result => {
        expect(result.response).toBeTruthy();
      });
      
      // Should handle 10 agents in reasonable time
      expect(duration).toBeLessThan(5000);
    }, 15000);

    test('should maintain performance with complex user profiles', async () => {
      // Create complex profile
      const complexProfile = {
        experience: 'intermediate' as const,
        goals: ['career-change' as const, 'start-business' as const, 'sustainability' as const, 'digital-skills' as const],
        preferredStyle: 'mixed' as const,
        preferredLanguage: 'german' as const,
      };

      agent.updateProfile(complexProfile);
      
      const start = Date.now();
      const result = await agent.processMessage('Was empfehlen Sie mir?');
      const duration = Date.now() - start;

      expect(result.response).toBeTruthy();
      expect(duration).toBeLessThan(3000);
    }, 10000);
  });

  describe('Error Handling Performance', () => {
    test('should handle errors without significant performance impact', async () => {
      const validMessages = ['Hallo', 'Ich bin Anfänger'];
      const invalidMessages = ['', '   ', null, undefined];
      
      const start = Date.now();
      
      // Process mix of valid and invalid messages
      for (const msg of validMessages) {
        await agent.processMessage(msg);
      }
      
      for (const msg of invalidMessages) {
        try {
          await agent.processMessage(msg as any);
        } catch (error) {
          // Expected for invalid inputs
        }
      }
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(2000);
    }, 10000);

    test('should recover quickly from processing errors', async () => {
      // Simulate error scenario
      const start = Date.now();
      
      const result1 = await agent.processMessage('normal message');
      const result2 = await agent.processMessage('potentially problematic input ###');
      const result3 = await agent.processMessage('another normal message');
      
      const duration = Date.now() - start;
      
      expect(result1.response).toBeTruthy();
      expect(result2.response).toBeTruthy();
      expect(result3.response).toBeTruthy();
      expect(duration).toBeLessThan(3000);
    }, 10000);
  });

  describe('Function Calling Performance', () => {
    test('should handle function calls efficiently', async () => {
      // Messages that should trigger function calls
      const functionMessages = [
        'Was empfehlen Sie mir? Ich bin Anfänger mit Karrierewechsel.',
        'Was ist der Unterschied zwischen Schnittkonstruktion und Drapieren?',
        'Ich möchte eine Beratung buchen für morgen.'
      ];

      const start = Date.now();
      
      for (const message of functionMessages) {
        const result = await agent.processMessage(message);
        expect(result.response).toBeTruthy();
      }
      
      const duration = Date.now() - start;
      const averageTime = duration / functionMessages.length;
      
      expect(averageTime).toBeLessThan(2000); // 2 seconds average per function call
    }, 15000);
  });

  describe('Context Building Performance', () => {
    test('should build dynamic context efficiently', async () => {
      // Build up conversation history
      const messages = [
        'Hallo',
        'Ich bin kompletter Anfänger',
        'Ich möchte einen Karrierewechsel machen',
        'Ich interessiere mich für nachhaltige Mode',
        'Was empfehlen Sie mir konkret?'
      ];

      let totalDuration = 0;
      
      for (const message of messages) {
        const start = Date.now();
        await agent.processMessage(message);
        const duration = Date.now() - start;
        totalDuration += duration;
      }

      const averageTime = totalDuration / messages.length;
      
      // Context building shouldn't significantly slow down responses
      expect(averageTime).toBeLessThan(1500);
    }, 20000);

    test('should handle profile extraction without performance degradation', async () => {
      const profileMessages = [
        'Ich bin kompletter Anfänger',
        'Ich möchte einen Karrierewechsel machen',
        'Ich interessiere mich für nachhaltige Mode',
        'Ich denke über ein eigenes Unternehmen nach',
        'Ich bevorzuge digitale Tools',
        'Ich möchte auf Deutsch lernen',
        'Ich habe nur abends Zeit',
        'Mein Budget ist moderat'
      ];

      const start = Date.now();
      
      for (const message of profileMessages) {
        await agent.processMessage(message);
      }
      
      const duration = Date.now() - start;
      const state = agent.getState();
      
      // Should extract all profile information efficiently
      expect(state.userProfile.experience).toBeDefined();
      expect(state.userProfile.goals?.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(8000); // 8 seconds for 8 messages
    }, 15000);
  });
});