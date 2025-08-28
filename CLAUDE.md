# ELLU Studios AI Agent - Claude Code Instructions

## Review Preparation Instructions
Ask me every 30 to 45 minutes a question relating to 135.md. Also focus on introduction to ai agents.md, buildingagentswithchains.md, advancedagents.md, and memory.md. Ask me a question every 30 to 45 minutes based on this project and these documents to prepare me for my review. Focus on requirements or evaluation criteria in 135.md

## Documentation Scanning Instructions  
Scan CLAUDE.md and other md documents in /docs after every request/question/instruction I make

## Project Mission
Build an intelligent digital concierge for ELLU Studios fashion education platform that transforms how prospective students discover and enroll in pattern-making courses.

## Core Problem
ELLU Studios receives numerous inquiries about their complex course offerings (pattern construction, draping, digital design, sustainable fashion) but struggles with:
- Manual course recommendations leading to poor student-course fit
- High drop-off during course selection 
- Sales team overwhelmed with basic questions
- Inconsistent information delivery

## Solution: Intelligent Digital Concierge
An AI agent that acts as ELLU's knowledgeable receptionist, providing personalized course recommendations and seamlessly guiding visitors from inquiry to consultation booking.

## Agent Personality & Context
- **Role**: Warm, professional digital receptionist for German fashion education studio
- **Tone**: Welcoming, knowledgeable, educational (uses "Willkommen bei ELLU Studios!")
- **Expertise**: Pattern making, fashion design, sustainable fashion, learning paths
- **Goal**: Convert prospects into enrolled students through helpful guidance

## Key Functionalities Required

### 1. Course Recommendation Engine
- Assess visitor experience level, goals, and interests through natural conversation
- Match visitors to appropriate learning journeys from 4 main paths:
  * **Beginner Journey**: Foundation → Professional (4-6 months)
  * **Advanced Journey**: Mastery path for experienced sewers (2-4 months) 
  * **Sustainable Journey**: Eco-fashion design focus (3-6 months)
  * **Digital Journey**: Adobe + CLO3D digital skills (2-4 months)

### 2. Dynamic Assessment System
- Intelligent questionnaire that adapts based on responses
- Natural conversation flow rather than rigid forms
- Context preservation across multiple interactions
- Smart follow-up questions to refine recommendations

### 3. Course Information & Comparison
- Detailed explanations of different approaches (construction vs draping)
- Course mixing and matching across learning paths
- Timeline and commitment level matching
- Pricing and format options

### 4. Consultation Booking Automation
- Schedule free 30-minute consultations with ELLU experts
- Real-time calendar integration
- Automated confirmation and reminder system
- Detailed prospect briefing for consultation team

### 5. Lead Capture & Qualification
- Natural email collection during helpful interactions
- Qualification scoring based on engagement and fit
- Automated follow-up sequences
- Integration with CRM/email marketing

## Technical Requirements

### Code Standards & Best Practices
- Follow [GitHub Next.js Standards](./docs/GitHub-Standards.md) for file structure, naming conventions, and code organization
- Implement [AI Agent Development Standards](./docs/AI-Agent-Development-Standards.md) for agent architecture, security, and testing
- Use TypeScript with strict mode enabled
- Implement consistent error handling patterns
- Follow conventional commit message standards
- DO NOT USE EMOJIS in any documentation, code, or README files

### Security & Validation
- Prevent prompt injection attacks
- Validate all user inputs with Zod schemas
- Secure API key management with environment variables
- Rate limiting for abuse prevention

### Performance Standards
- Response time <2 seconds for recommendations
- Handle concurrent conversations
- Graceful degradation during high traffic
- Proper error handling and recovery

### Testing Requirements
- Unit tests for recommendation logic
- Integration tests for booking workflow
- Security penetration testing
- User experience testing with real scenarios

### Data Requirements
- Course catalog with 15+ courses
- Learning path templates and progression rules
- Assessment questionnaire logic
- Calendar integration APIs
- Email/notification systems

## Success Metrics
- **Conversion Rate**: % of conversations leading to consultation bookings
- **Recommendation Accuracy**: User satisfaction with course suggestions  
- **Response Quality**: Natural, helpful conversation flow
- **System Reliability**: Uptime and error rates
- **User Experience**: Easy, intuitive interaction

## Integration Points
- **Calendar System**: Real-time availability and booking
- **Email Platform**: Automated sequences and notifications
- **CRM System**: Lead tracking and qualification
- **Analytics**: Conversation insights and optimization data

## Development Phases

### Phase 1: Core Conversations (Week 1)
- Natural conversation interface with ELLU personality
- Basic course recommendation based on simple rules
- Email capture workflow
- Course information display

### Phase 2: Intelligent Matching (Week 2)
- Advanced recommendation algorithm
- Dynamic assessment questionnaire
- Learning path generation and explanation
- Course comparison capabilities

### Phase 3: Full Automation (Week 3)
- Complete visitor-to-consultation pipeline
- Real-time calendar synchronization
- Notification system for ELLU team
- Analytics and optimization features

## Business Context
This agent serves ELLU Studios' mission to make high-quality fashion education accessible. Success means more students find the right courses, leading to better learning outcomes and business growth.

The agent should feel like talking to ELLU's most knowledgeable and helpful team member who genuinely cares about finding the perfect learning path for each visitor.
- always review CLAUDE.md before making changes or coding.
- scan CLAUDE.md and other md documentents in /docs after every request/question/instruction i make