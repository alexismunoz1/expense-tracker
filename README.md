# Finny

AI-powered expense tracker with conversational interface for managing expenses via natural language.

## Features

- **Conversational AI Interface** - Chat with Finny in Spanish to manage your expenses
- **Multi-Currency Support** - Track expenses in USD and ARS with automatic detection
- **OCR Receipt Processing** - Upload receipt images for automatic expense extraction
- **Smart Categories** - AI-powered category detection and management
- **Real-time Streaming** - Instant AI responses with streaming technology
- **Secure Authentication** - Google OAuth via Supabase
- **Multi-tenant Architecture** - Row-level security for data isolation

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Vercel AI SDK with xAI Grok-3
- Radix UI Themes (WCAG 2.1 AA)
- Supabase (PostgreSQL + Auth)
- Tesseract.js for OCR
- Turbopack bundler

## Getting Started

```bash
# Install dependencies
yarn

# Set up environment variables
cp .env.example .env.local
# Add your Supabase and xAI API keys

# Run development server
yarn dev

# Build for production
yarn build
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
XAI_API_KEY=your_xai_api_key
```

## Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed architecture and development guidelines.
