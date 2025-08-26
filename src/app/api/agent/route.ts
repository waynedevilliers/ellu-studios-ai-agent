// ELLU Studios AI Agent API Route
// Following CLAUDE.md requirements and Next.js standards

import { NextRequest, NextResponse } from 'next/server';
import { ELLUAgent } from '@/lib/agent/core';
import { validateUserMessage } from '@/lib/security/validation';
import { z } from 'zod';

// Session storage (in production, use Redis or database)
const sessions = new Map<string, ELLUAgent>();

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { message, sessionId } = validateUserMessage(body);

    // Get or create agent session
    let agent = sessions.get(sessionId);
    if (!agent) {
      agent = new ELLUAgent(sessionId);
      sessions.set(sessionId, agent);
    }

    // Process message with agent
    const result = await agent.processMessage(message);

    // Return response
    return NextResponse.json({
      response: result.response,
      blocked: result.blocked || false,
      sessionId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agent API Error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
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
    }
  });
}