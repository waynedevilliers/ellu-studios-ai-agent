// Security Validation Layer
// Following CLAUDE.md requirements and AI Agent Development Standards

import { z } from 'zod';

// User input validation schemas
export const UserMessageSchema = z.object({
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message too long')
    .refine(msg => !containsPromptInjection(msg), 'Invalid input detected'),
  sessionId: z.string().uuid(),
  userId: z.string().optional(),
});

export const UserProfileSchema = z.object({
  experience: z.enum(['complete-beginner', 'some-sewing', 'intermediate', 'advanced']).optional(),
  goals: z.array(z.enum(['hobby', 'career-change', 'start-business', 'sustainability', 'digital-skills'])).optional(),
  timeCommitment: z.enum(['minimal', 'moderate', 'intensive']).optional(),
  interests: z.array(z.string()).optional(),
  preferredStyle: z.enum(['precise-technical', 'creative-intuitive', 'mixed']).optional(),
  budget: z.enum(['budget-conscious', 'moderate', 'premium']).optional(),
  timeline: z.enum(['asap', '1-3months', '3-6months', 'flexible']).optional(),
  email: z.string().email().optional(),
});

export const EmailCaptureSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  interest: z.string().optional(),
});

export const ConsultationBookingSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  phone: z.string().optional(),
  preferredDate: z.string(), // ISO date string
  preferredTime: z.string(),
  timezone: z.string().default('Europe/Berlin'),
  message: z.string().max(500).optional(),
});

// Prompt injection detection patterns
const INJECTION_PATTERNS = [
  /ignore.*(previous|above|earlier).*(instruction|prompt|rule)/i,
  /you are now/i,
  /system.*override/i,
  /jailbreak/i,
  /act as if/i,
  /pretend to be/i,
  /roleplay.*as/i,
  /(tell|show|give|provide).*(system|instruction|prompt)/i,
  /what.*your.*(instruction|prompt|system)/i,
  /bypass.*(safety|security|filter)/i,
];

/**
 * Detect potential prompt injection attempts
 */
export function containsPromptInjection(input: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Sanitize user input for safe processing
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 2000); // Limit length
}

/**
 * Sanitize agent output before sending to user
 */
export function sanitizeOutput(output: string): string {
  return output
    .replace(/ANTHROPIC_API_KEY/gi, '[REDACTED]')
    .replace(/API_KEY/gi, '[REDACTED]')
    .replace(/password/gi, '[REDACTED]')
    .replace(/secret/gi, '[REDACTED]');
}

/**
 * Validate and parse user message
 */
export function validateUserMessage(data: unknown) {
  return UserMessageSchema.parse(data);
}

/**
 * Validate and parse user profile data
 */
export function validateUserProfile(data: unknown) {
  return UserProfileSchema.parse(data);
}

/**
 * Validate email capture data
 */
export function validateEmailCapture(data: unknown) {
  return EmailCaptureSchema.parse(data);
}

/**
 * Validate consultation booking data
 */
export function validateConsultationBooking(data: unknown) {
  return ConsultationBookingSchema.parse(data);
}