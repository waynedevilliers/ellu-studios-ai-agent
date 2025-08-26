// ELLU Studios AI Agent - Core Type Definitions
// Following CLAUDE.md requirements and GitHub standards

export interface Course {
  id: string;
  name: string;
  nameGerman: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  format: 'online' | 'in-person' | 'hybrid';
  skills: string[];
  prerequisites: string[];
  outcomes: string[];
  category: 'construction' | 'draping' | 'digital' | 'sustainable';
  pricing: {
    amount: number;
    currency: string;
    installments?: boolean;
  };
  perfectFor: string[];
}

export interface LearningJourney {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  duration: string;
  phases: JourneyPhase[];
  outcome: string;
  courses: string[]; // Course IDs
}

export interface JourneyPhase {
  phase: number;
  name: string;
  duration: string;
  courses: string[];
  description: string;
}

export interface UserProfile {
  experience: 'complete-beginner' | 'some-sewing' | 'intermediate' | 'advanced';
  goals: ('hobby' | 'career-change' | 'start-business' | 'sustainability' | 'digital-skills')[];
  timeCommitment: 'minimal' | 'moderate' | 'intensive';
  interests: string[];
  preferredStyle: 'precise-technical' | 'creative-intuitive' | 'mixed';
  budget?: 'budget-conscious' | 'moderate' | 'premium';
  timeline?: 'asap' | '1-3months' | '3-6months' | 'flexible';
  email?: string;
}

export interface ConversationState {
  phase: 'greeting' | 'assessment' | 'recommendation' | 'scheduling' | 'followup';
  userProfile: Partial<UserProfile>;
  assessmentStep: number;
  recommendations: CourseRecommendation[];
  conversationHistory: Message[];
  intents: string[];
}

export interface CourseRecommendation {
  course: Course;
  matchScore: number;
  reasoning: string;
  journey?: LearningJourney;
}

export interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
  };
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'single-choice' | 'multiple-choice' | 'text' | 'scale';
  options?: string[];
  followUp?: (answer: string) => AssessmentQuestion | null;
}