@AGENTS.md

# Musa — AI Content Intelligence for Social Media Managers

## Context
Musa is a Next.js app that helps social media managers create high-performing content. It uses AI (Claude API) to analyze viral references, generate content ideas, and produce ready-to-publish copy/scripts.

**Deadline**: 30/03/2026 14h (Desafio Human Academy)

## Stack & Architecture
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with CSS variables (dark theme)
- **Animations**: Framer Motion (`motion/react`)
- **AI**: Anthropic Claude API via `@anthropic-ai/sdk`
- **Scraping**: Apify actors (Instagram/TikTok)
- **State**: React hooks + localStorage for workspace

### Key Directories
```
src/
├── app/
│   ├── api/          # API routes (analyze, brief, copy, ideas, search)
│   ├── workspace/    # Multi-tab workspace (clients, history, calendar, reports)
│   └── page.tsx      # Main Musa flow (search → analyze → ideas → copy)
├── components/       # UI components
├── lib/
│   ├── claude.ts     # askClaude(), parseClaudeJSON() helpers
│   ├── types.ts      # All TypeScript interfaces
│   └── utils.ts      # cn() utility
```

## Design System
- **Primary**: `hsl(var(--primary))` — vibrant accent
- **Background**: Dark theme with `surface-1`, `surface-2` layers
- **Cards**: `.card` class with subtle border and hover states
- **Typography**: System font stack, mono for scripts/code
- **Animations**: Framer Motion for page transitions, typewriter for copy output
- **Icons**: Lucide React

## Code Conventions
- Use `askClaude(systemPrompt, userMessage)` for all AI calls
- Use `parseClaudeJSON<T>(raw)` to parse AI responses
- Import motion from `motion/react` (NOT `framer-motion`)
- Use `cn()` from `@/lib/utils` for conditional classes
- API routes return `NextResponse.json()`
- All AI responses must be valid JSON (no markdown wrapping)

## UX Guidelines
- Toast notifications for errors (react-hot-toast)
- Skeleton loaders during API calls
- Typewriter effect for copy output
- Progressive disclosure (step-by-step flow)
- Mobile-responsive design

## API Routes
| Route | Purpose | Model |
|-------|---------|-------|
| `/api/search` | Apify scraping for references | - |
| `/api/analyze` | Analyze viral content (7 dimensions) | creative |
| `/api/brief` | Decode client briefings | creative |
| `/api/ideas` | Generate content ideas from patterns | creative |
| `/api/copy` | Full copy/script production | creative |

## External APIs
- **Anthropic**: `ANTHROPIC_API_KEY` — Claude Sonnet for creative, Haiku for fast
- **Apify**: `APIFY_TOKEN` — Instagram scraper (`apify/instagram-scraper`), TikTok scraper

## What NOT to Do
- Don't use `"use server"` directives — use API routes instead
- Don't import from `framer-motion` — use `motion/react`
- Don't add `console.log` in production code
- Don't hardcode API keys
- Don't create new pages without updating navigation
- Don't change the dark theme — it's intentional

## Available Skills
- `/frontend-design` — Professional UI components
- `/marketing` — Copywriting, CRO, growth hacking
- `/seo` — SEO optimization
- `/blog` — Content creation frameworks
- `/musa-content` — Viral content analysis (7 dimensions, hook formulas, platform guidelines)
