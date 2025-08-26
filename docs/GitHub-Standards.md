# GitHub Coding Standards for Next.js

This document outlines GitHub's recommended coding standards and best practices for Next.js projects, ensuring consistency, maintainability, and collaboration.

## 📁 Repository Structure

### Standard Next.js 14+ App Router Structure
```
project-name/
├── .github/
│   ├── workflows/              # GitHub Actions CI/CD
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   └── pull_request_template.md
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   └── features/          # Feature-specific components
│   ├── lib/
│   │   ├── utils.ts           # Utility functions
│   │   ├── db.ts              # Database configuration
│   │   └── validations.ts     # Zod schemas
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── tests/
│   ├── __mocks__/            # Jest mocks
│   ├── unit/                 # Unit tests
│   └── integration/          # Integration tests
├── docs/                     # Project documentation
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── README.md                # Project documentation
├── package.json             # Dependencies and scripts
└── next.config.js           # Next.js configuration
```

## 📝 File Naming Conventions

### Components
✅ **Recommended:**
- `UserProfile.tsx`
- `CourseCard.tsx`
- `NavigationMenu.tsx`
- `EmailCaptureForm.tsx`

❌ **Avoid:**
- `userProfile.tsx` (camelCase)
- `course-card.tsx` (kebab-case)
- `navigation_menu.tsx` (snake_case)

### Pages (App Router)
✅ **Standard Files:**
- `page.tsx` - Page component
- `layout.tsx` - Layout wrapper
- `loading.tsx` - Loading UI
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 page

✅ **Dynamic Routes:**
- `[id]/page.tsx` - Dynamic route
- `[...slug]/page.tsx` - Catch-all route
- `[[...slug]]/page.tsx` - Optional catch-all

### API Routes
✅ **Recommended:**
- `route.ts` - API route handler
- `api/users/route.ts` - Users endpoint
- `api/courses/[id]/route.ts` - Dynamic course endpoint

❌ **Avoid:**
- `api.ts`
- `users.ts`
- `getUserById.ts`

## 🎯 TypeScript Standards

### Interface Naming
```typescript
✅ Recommended:
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserCreateRequest {
  name: string;
  email: string;
}

interface CourseRecommendation {
  courseId: string;
  matchScore: number;
  reasoning: string;
}

❌ Avoid:
interface IUser {}        // No 'I' prefix
interface user {}         // Must use PascalCase
interface UserType {}     // Redundant 'Type' suffix
```

### Component Typing
```typescript
✅ Recommended:
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ 
  variant, 
  size = 'md', 
  children, 
  onClick, 
  disabled = false 
}: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### API Route Typing
```typescript
✅ Recommended:
import { NextRequest } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RequestSchema.parse(body);
    
    // Process request
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }
}
```

## 🔒 Security Standards

### Environment Variables
```typescript
✅ Recommended:
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);

// Usage
import { env } from '@/lib/env';
const apiKey = env.ANTHROPIC_API_KEY;
```

### Input Validation
```typescript
✅ Recommended:
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(13).max(120).optional(),
});

// In API route
export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = CreateUserSchema.safeParse(body);
  
  if (!result.success) {
    return Response.json(
      { error: 'Validation failed', details: result.error }, 
      { status: 400 }
    );
  }
  
  // Process validated data
  const { name, email, age } = result.data;
}
```

## 📋 Git Standards

### Conventional Commits
```bash
✅ Recommended:
feat: add user authentication system
fix: resolve session timeout issue
docs: update API documentation
style: format code with prettier
refactor: restructure user service
test: add unit tests for auth module
chore: update dependencies

❌ Avoid:
"Fixed stuff"
"Update"
"Changes"
"WIP"
```

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

**Example:**
```
feat(auth): implement OAuth2 login system

Add Google and GitHub OAuth providers with secure token handling.
Includes rate limiting and session management for enhanced security.

Closes #123
Refs #456
```

### Branch Naming
```bash
✅ Recommended:
feature/user-authentication
fix/session-timeout-bug
docs/update-readme
refactor/user-service
hotfix/security-patch

❌ Avoid:
new-feature
bugfix
update
changes
```

## 🧪 Testing Standards

### Test File Organization
```
tests/
├── unit/
│   ├── components/
│   │   ├── Button.test.tsx
│   │   └── CourseCard.test.tsx
│   └── lib/
│       ├── utils.test.ts
│       └── validation.test.ts
├── integration/
│   └── api/
│       ├── auth.test.ts
│       └── courses.test.ts
└── e2e/
    ├── user-journey.test.ts
    └── booking-flow.test.ts
```

### Test Naming Conventions
```typescript
✅ Recommended:
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {
      // Test implementation
    });
    
    it('should reject invalid email format', () => {
      // Test implementation
    });
    
    it('should handle duplicate email gracefully', () => {
      // Test implementation
    });
  });

  describe('getUserById', () => {
    it('should return user when ID exists', () => {
      // Test implementation
    });
    
    it('should return null when ID does not exist', () => {
      // Test implementation
    });
  });
});
```

## 📦 Package.json Standards

### Required Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test"
  }
}
```

### Dependency Organization
```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.60.0",
    "next": "15.5.0",
    "react": "19.1.1",
    "zod": "^4.1.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.8.0",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^24.3.0",
    "eslint": "^9.34.0",
    "jest": "^30.0.5",
    "typescript": "^5.9.2"
  }
}
```

## 📚 Documentation Standards

### README.md Structure
```markdown
# Project Name

Brief description of what the project does and its main value proposition.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/username/project-name.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

## 📁 Project Structure
Brief explanation of key folders and their purposes.

## 🔧 Configuration
Environment variables and configuration options.

## 🧪 Testing
How to run tests and testing conventions.

## 🚀 Deployment
Deployment instructions and requirements.

## 🤝 Contributing
Contribution guidelines and code of conduct.

## 📄 License
License information.
```

### Component Documentation
```typescript
/**
 * Course recommendation card component
 * 
 * Displays course information with matching score and reasoning.
 * Includes action buttons for more info and booking consultations.
 * 
 * @example
 * <CourseCard
 *   course={courseData}
 *   matchScore={85}
 *   reasoning="Perfect fit for your experience level"
 *   onLearnMore={handleLearnMore}
 *   onBookConsultation={handleBooking}
 * />
 */
interface CourseCardProps {
  course: Course;
  matchScore: number;
  reasoning: string;
  onLearnMore: (courseId: string) => void;
  onBookConsultation: (courseId: string) => void;
}
```

## ⚙️ Configuration Files

### .gitignore Standards
```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output

# Next.js
.next/
out/

# Production
build/
dist/

# Environment variables
.env*.local
.env

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
```

### ESLint Configuration
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "no-console": "warn",
    "eqeqeq": "error"
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  }
}
```

## 🚀 GitHub Actions

### CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run tests
        run: npm run test:coverage

      - name: Build application
        run: npm run build

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## 🎯 GitHub Repository Standards

### Branch Protection Rules
- Require pull request reviews
- Require status checks to pass
- Require up-to-date branches
- Include administrators in restrictions

### Pull Request Template
```markdown
## 📝 Description
Brief description of changes made.

## 🏷️ Type of Change
- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that causes existing functionality to change)
- [ ] 📚 Documentation update
- [ ] 🔧 Code refactoring

## 🧪 Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed

## ✅ Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Code is commented (particularly complex areas)
- [ ] Corresponding documentation updated
- [ ] No breaking changes without migration guide
- [ ] All tests are passing

## 📸 Screenshots (if applicable)
Add screenshots of UI changes.

## 🔗 Related Issues
Closes #(issue number)
```

## 📊 Code Quality Metrics

### Required Standards
- **Test Coverage:** >80% overall, >90% for critical paths
- **TypeScript:** Strict mode enabled, no `any` types
- **ESLint:** Zero errors, warnings acceptable with justification
- **Bundle Size:** <500KB initial load, <200KB per route
- **Performance:** Lighthouse score >90
- **Accessibility:** WCAG 2.1 AA compliance

### Recommended Tools
- **Prettier:** Code formatting
- **Husky:** Git hooks for quality checks
- **lint-staged:** Pre-commit linting
- **Commitizen:** Conventional commit messages
- **Renovate/Dependabot:** Automated dependency updates
- **CodeClimate/SonarQube:** Code quality analysis

## 🎯 Best Practices Summary

### Security
1. Never commit secrets or API keys
2. Validate all inputs with Zod schemas
3. Use environment variables for configuration
4. Implement proper error handling
5. Enable TypeScript strict mode

### Performance
1. Use Next.js Image component for images
2. Implement proper caching strategies
3. Lazy load components when appropriate
4. Optimize bundle size with tree shaking
5. Monitor Core Web Vitals

### Maintainability
1. Write self-documenting code
2. Use consistent naming conventions
3. Keep functions small and focused
4. Write comprehensive tests
5. Document complex business logic

### Collaboration
1. Write clear commit messages
2. Use descriptive pull request titles
3. Review code thoroughly
4. Keep documentation up-to-date
5. Follow established patterns

---

**Remember:** These standards ensure consistency, maintainability, and collaboration across the development team. Adapt them to your specific project needs while maintaining the core principles.