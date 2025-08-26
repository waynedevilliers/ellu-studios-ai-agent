# ELLU Studios AI Agent

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Claude API](https://img.shields.io/badge/Claude%20API-Latest-orange)](https://docs.anthropic.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**An intelligent digital concierge for ELLU Studios fashion education platform**

Transform how prospective students discover and enroll in pattern-making courses through AI-powered conversations, personalized recommendations, and automated consultation booking.

## Problem Solved

Fashion education platforms struggle with:
- Manual course recommendations leading to poor student-course fit
- High drop-off rates during course selection process  
- Sales teams overwhelmed with basic qualification questions
- Inconsistent information delivery about complex learning paths

**Solution**: An AI agent that acts as ELLU's knowledgeable receptionist, providing personalized course recommendations and seamlessly guiding visitors from inquiry to consultation booking.

## Key Features

### Intelligent Course Matching
- **Smart Assessment**: Dynamic questionnaire that adapts based on user responses
- **Personalized Recommendations**: Match visitors to 4 specialized learning journeys
- **Course Comparisons**: Detailed explanations of different approaches (construction vs draping)

### Learning Journey Paths
- **Beginner Journey**: Foundation → Professional (4-6 months)
- **Advanced Journey**: Mastery path for experienced sewers (2-4 months)  
- **Sustainable Journey**: Eco-fashion design focus (3-6 months)
- **Digital Journey**: Adobe + CLO3D digital skills (2-4 months)

### Conversational AI
- **Natural Conversations**: Warm, professional ELLU personality
- **Context Preservation**: Maintains conversation state across interactions
- **Multilingual**: German phrases for authentic studio experience

### Automation Features
- **Consultation Booking**: Real-time calendar integration
- **Lead Qualification**: Smart scoring and CRM integration
- **Email Automation**: Automated follow-up sequences
- **Analytics**: Conversation insights and optimization

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Claude API key from [Anthropic](https://console.anthropic.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/waynedevilliers/ellu-studios-ai-agent.git
   cd ellu-studios-ai-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys to `.env.local`:
   ```env
   ANTHROPIC_API_KEY=your_claude_api_key_here
   JWT_SECRET=your_jwt_secret_here
   ENCRYPTION_KEY=your_32_byte_encryption_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Tech Stack

### Core Technologies
- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **AI**: Claude API (Anthropic)
- **Styling**: Tailwind CSS
- **Validation**: Zod schemas

### Development & Quality
- **Testing**: Jest + Testing Library
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript compiler
- **Git Hooks**: Husky + lint-staged

### Architecture
- **Security-First**: Input validation, prompt injection prevention
- **Performance**: <2s response times, concurrent user support
- **Scalable**: Modular design ready for multi-agent evolution

## Project Structure

```
ellu-studios-ai-agent/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes (agent endpoints)
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   └── features/      # Feature-specific components
│   ├── lib/               # Core libraries
│   │   ├── agent/         # AI agent logic
│   │   ├── security/      # Security utilities
│   │   └── utils/         # General utilities
│   └── types/             # TypeScript definitions
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── security/         # Security tests
├── public/               # Static assets
└── docs/                # Documentation (local only)
```

## Testing

### Test Coverage Requirements
- Overall coverage: >80%
- Security functions: >95%
- Core agent logic: >90%

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run specific test suites
npm run test -- --testNamePattern="Security"
```

### Test Categories
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and tool interactions
- **Security Tests**: Prompt injection prevention, input validation
- **E2E Tests**: Complete conversation flows

## Security

### Security Measures Implemented
- **Input Validation**: All inputs validated with Zod schemas
- **Prompt Injection Prevention**: Detection and blocking of malicious inputs
- **Output Sanitization**: Safe response generation
- **Rate Limiting**: Abuse prevention mechanisms
- **Environment Security**: Secure API key management
- **Session Isolation**: Complete user data separation

### Security Testing
All security functions are tested with >95% coverage including:
- Common prompt injection patterns
- Input validation edge cases
- Output sanitization verification
- Rate limiting effectiveness

## Usage Examples

### Basic Conversation Flow
```
Agent: "Willkommen bei ELLU Studios! I'm here to help you discover the 
        perfect pattern making journey. Are you new to fashion design?"

User: "I'm completely new but interested in changing careers"

Agent: "Wonderful! Career changes in fashion can be incredibly rewarding. 
        Let me ask a few questions to create your personalized learning plan..."
```

### Course Recommendation
```
Agent: "Based on your answers, I recommend our Foundation to Professional Journey:
        
        Phase 1: Klassische Schnittkonstruktion (Months 1-2)
        Phase 2: Professional Sewing Techniques (Months 3-4)  
        Phase 3: Specialization Choice (Months 5-6)
        
        Would you like to schedule a free consultation to discuss this path?"
```

## Performance Metrics

### Response Times
- Simple queries: <2 seconds
- Complex reasoning: <10 seconds  
- Tool execution: <15 seconds
- Hard timeout: 30 seconds

### Scalability
- Concurrent users: 100+ simultaneous conversations
- Memory usage: <100MB per session
- Token optimization: <1000 tokens per exchange

## Deployment

### Environment Setup
1. Set up production environment variables
2. Configure database connections (if using persistent storage)
3. Set up monitoring and logging
4. Configure CI/CD pipeline

### Production Checklist
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Environment variables secured
- [ ] Monitoring configured
- [ ] Backup procedures tested

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow our coding standards (TypeScript, ESLint)
4. Write tests for new functionality
5. Ensure all tests pass: `npm run test`
6. Commit with conventional commits: `feat: add amazing feature`
7. Push to your branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Maintain >80% test coverage
- Write self-documenting code
- Follow security-first development

## Related Projects

- [ELLU Studios Website](https://ellustudios.com) - Main fashion education platform
- [Fashion Education Resources](https://github.com/topics/fashion-education) - Community resources

## Project Status

**Current Phase**: Development (MVP Implementation)
- Project planning and architecture (Complete)
- Security framework implementation (Complete)
- Core agent development in progress
- UI components and testing (Pending)
- Production deployment (Pending)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **ELLU Studios** - For the inspiring fashion education mission
- **Anthropic** - For the powerful Claude API
- **Turing College** - For the educational framework and project requirements
- **Next.js Team** - For the excellent development framework

---

**Built for fashion education and AI innovation**

For questions or support, please [open an issue](https://github.com/waynedevilliers/ellu-studios-ai-agent/issues) or contact the development team.