# AI Agent Development Project

A production-ready AI agent built with Claude API, Next.js, and TypeScript.

## Features

- 🤖 Claude API integration
- 🔒 Security-first design with input validation and prompt injection prevention
- 🧪 Comprehensive testing (Unit, Integration, Security)
- ⚡ Next.js 14+ with TypeScript
- 🎨 Tailwind CSS for minimal styling
- 📝 Zod schemas for validation

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment variables: `cp .env.example .env.local`
4. Add your Claude API key to `.env.local`
5. Run development server: `npm run dev`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
src/
├── app/                    # Next.js app router
├── components/             # React components
├── lib/
│   ├── agent/             # Agent core functionality
│   ├── security/          # Security utilities
│   └── utils/             # General utilities
└── tests/                 # Test files
```

## Documentation

See the [docs](./docs/) folder for detailed documentation:

- [CLAUDE.md](./docs/CLAUDE.md) - Claude Code specific guidelines

## Environment Variables

Required environment variables (see `.env.example`):

- `ANTHROPIC_API_KEY` - Your Claude API key
- `JWT_SECRET` - Secret for JWT tokens
- `ENCRYPTION_KEY` - 32-byte encryption key

## Security

This project implements security best practices:

- Input validation with Zod schemas
- Prompt injection detection and prevention
- Rate limiting
- Secure environment variable handling

## Testing

Comprehensive testing strategy:

- Unit tests with Jest
- Integration tests
- Security tests for prompt injection and validation
- Minimum 80% code coverage required

## Contributing

1. Follow the security-first approach
2. Write tests for all new features
3. Ensure all tests pass before submitting
4. Follow TypeScript and ESLint guidelines

## License

MIT