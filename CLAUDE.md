# CLAUDE.md

AI-powered expense tracker with Next.js 16, React 19, Vercel AI SDK. Conversational interface in Spanish for managing expenses via natural language.

## Commands

```bash
yarn dev          # Dev server with Turbopack
yarn build        # Production build
yarn start        # Start production server
yarn lint         # Run ESLint
```

### Git Commits

DO NOT include AI attribution signatures. Keep commits clean and professional.

## Coding Standards

**File Naming:** All files use kebab-case (e.g., `user-profile.ts`, `chat-message.tsx`, `use-file-upload.ts`)

## Tech Stack

- **Next.js 16** + React 19 + TypeScript
- **Turbopack:** Default bundler, `serverExternalPackages: ['tesseract.js']` in config
- **React Compiler:** Enabled (`reactCompiler: true`) - auto memoization
- **Radix UI Themes 3.2.1:** Accessible design system, dark mode, WCAG 2.1 AA
- **AI SDK 5.0.87:** Streaming with xAI Grok-3 model
- **Tesseract.js 6.0.1:** OCR for receipt processing
- **Supabase:** PostgreSQL + OAuth (Google) + Row Level Security
- **Zod 4.1.8:** Schema validation
- **nanoid 5.1.6:** Unique ID generation

## Architecture

### Core Components
- `src/app/api/chat/route.ts` - Streaming chat with tool execution + auth
- `src/schemas/tools.ts` - Zod schemas for AI tools
- `src/utils/tools.ts` - Tool executors
- `src/utils/expenses.ts` - Supabase data layer with RLS
- `src/lib/supabase/` - Auth clients (server/browser)
- `src/proxy.ts` - Session management + route protection

### AI Tools (Grok-3)
1. **gestionarGasto** - crear/obtener/modificar expenses (multi-currency: USD/ARS, auto-detection)
2. **gestionarCategoria** - crear/obtener categories
3. **procesarImagenRecibo** - OCR with Tesseract.js, smart clarification for unclear descriptions

### Data Model
**Expense:** id, user_id, titulo, precio, currency (USD|ARS), categoria, fecha (ISO 8601)
**Category:** id, user_id, nombre, color, icono, fechaCreacion
**UserProfile:** user_id, preferred_currency, created_at, updated_at

### Database
- PostgreSQL via Supabase with RLS (multi-tenant by user_id)
- Server: `src/lib/supabase/server.ts`, Client: `src/lib/supabase/client.ts`

### Frontend

**Modular Chat UI** (`src/app/chat/`)
- Hooks: `useChatMessages.ts`, `useFileUpload.ts`
- Components: 12 specialized components (ChatHeader, WelcomeScreen, ChatMessage, etc.)
- Types: `chat.types.ts` (Message, ChatStatus, SendMessageParams, QuickAction)
- Radix UI: Flex, Box, Button, TextField, Card, Spinner, Callout

**Pages:**
- `src/app/onboarding/page.tsx` - Currency selection, creates profile
- `src/app/auth/signin/page.tsx` - OAuth sign-in
- `src/components/AuthButton.tsx` - Profile dropdown

**Features:** WCAG 2.1 AA, keyboard navigation, streaming with `useChat`, protected routes, onboarding gate

### Types
- `src/types/expense.ts` - Expense, Category, UserProfile, CurrencyCode, CURRENCY_INFO
- `src/types/tools.ts` - Tool inputs, OcrResult, isDescriptionUnclear()
- `src/app/chat/types/chat.types.ts` - Message, MessagePart, ChatStatus

### Utilities
- `src/utils/currency.ts` - formatCurrency(), parseCurrencyFromText(), extractAmountFromText()
- `src/utils/user-profile.ts` - getUserProfile(), createUserProfile(), hasCompletedOnboarding()

### AI Config
- **Grok-3** with Spanish system prompt
- `stopWhen: stepCountIs(4)` - prevents infinite loops
- Dynamic prompt enrichment for OCR clarification
- Currency awareness (loads user's preferred_currency)
- Image filtering via `removeImagesFromMessages()` (Grok-3 no image support)
- Stream errors as messages (prevents stuck status)

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
XAI_API_KEY
```

## Key Features

- **Multi-Currency:** USD/ARS with auto-detection from text
- **OCR Receipt Processing:** Tesseract.js with smart clarification for unclear descriptions
- **Multi-Tenant:** RLS policies isolate data by user_id
- **Modular Chat UI:** 12 components, custom hooks, type-safe
- **Onboarding:** First-time currency selection
- **Auth:** Google OAuth via Supabase
- **Streaming:** Real-time AI responses with error handling
