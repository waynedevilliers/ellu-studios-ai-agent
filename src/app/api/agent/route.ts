// ELLU Studios AI Agent API Route
// Following CLAUDE.md requirements and Next.js standards

import { NextRequest, NextResponse } from 'next/server';
import { AdvancedELLUAgent } from '@/lib/agent/advanced-agent';
import { validateUserMessage } from '@/lib/security/validation';
import { LLMSettings } from '@/lib/llm/multi-llm-agent';
import { z } from 'zod';

// Session storage (in production, use Redis or database)
const sessions = new Map<string, AdvancedELLUAgent>();

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { message, sessionId } = validateUserMessage(body);
    const llmSettings: Partial<LLMSettings> = body.llmSettings || {};

    // Get or create agent session
    let agent = sessions.get(sessionId);
    if (!agent) {
      agent = new AdvancedELLUAgent(llmSettings);
      sessions.set(sessionId, agent);
    }

    // Process message with agent
    const result = await agent.processMessage(message);

    // Return response
    return NextResponse.json({
      response: result.response,
      blocked: result.blocked || false,
      tokensUsed: result.tokensUsed || 0,
      sessionId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agent API Error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'ELLU Studios AI Agent API',
    version: '1.0.0',
    endpoints: {
      POST: 'Send message to agent',
      GET: 'API information'
    },
    debug: {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      keyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'none',
      nodeEnv: process.env.NODE_ENV
    }
  });
}