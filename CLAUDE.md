# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 application using the App Router that provides an AI chat interface with dynamic agent creation capabilities. Users can create custom AI agents with different specialties and interact with them through a chat interface powered by OpenRouter API.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture Overview

### Core Systems

1. **Agent System**: Dynamic AI agents stored in Supabase
   - Agent definitions in `src/data/agents.json` (for initial seeding)
   - Agent management API in `src/app/api/agents/`
   - UI components in `src/components/agents/`

2. **Chat System**: Real-time chat with streaming responses
   - Chat API route: `src/app/api/chat/route.ts`
   - OpenRouter integration in `src/lib/openrouter/`
   - Chat UI components in `src/components/chat/`

3. **Artifact System**: Document creation and editing
   - Artifact types defined in `src/types/artifact.ts`
   - Artifact component in `src/components/artifact.tsx`
   - Tools integration in `src/lib/ai/prompts.ts`

4. **Theme System**: Dark/light mode support
   - Theme provider in `src/components/theme-provider.tsx`
   - Custom Tailwind theme in `tailwind.config.ts`
   - CSS variables in `src/app/globals.css`

### Key Design Patterns

- **Server Components**: Using Next.js App Router for optimal performance
- **Streaming Responses**: AI responses stream in real-time using Server-Sent Events
- **Component Library**: Uses shadcn/ui pattern with Radix UI primitives
- **State Management**: React hooks and context for local state
- **Database**: Supabase for persistent storage with TypeScript types

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
```

### Database Schema

The Supabase database includes:
- `chats`: Chat sessions
- `messages`: Individual messages within chats
- `agents`: AI agent definitions
- `artifacts`: Document artifacts created by agents

### Important Considerations

1. **No Test Suite**: Currently no testing infrastructure is set up
2. **Type Safety**: Strict TypeScript configuration - ensure all new code is properly typed
3. **Path Aliases**: Use `@/` for imports from `src/` directory
4. **Streaming**: When modifying chat functionality, maintain streaming response capability
5. **UI Components**: Follow existing patterns in `src/components/ui/` when adding new components