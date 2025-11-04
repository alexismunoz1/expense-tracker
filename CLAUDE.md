# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An AI-powered expense tracking application built with Next.js 16, React 19, and the Vercel AI SDK. The application features a conversational interface where users can manage expenses and categories through natural language interactions in Spanish.

## Commands

### Development
```bash
yarn dev          # Start development server with Turbopack (enabled by default in Next.js 16)
yarn build        # Build for production with Turbopack
yarn start        # Start production server
yarn lint         # Run ESLint directly (no longer using next lint)
```

## Technical Stack

### Core Framework
- **Next.js:** 16.0.2-canary.6 (latest canary with Turbopack as default bundler)
- **React:** 19.1.0
- **React DOM:** 19.1.0
- **TypeScript:** ^5

### Build & Development Tools
- **Turbopack:** Enabled by default in Next.js 16 (no flag required)
- **React Compiler:** Enabled via `reactCompiler: true` in next.config.ts
  - Provides automatic memoization and optimization
  - Requires `babel-plugin-react-compiler@^1.0.0`
- **ESLint:** 8.57.1 with eslint-config-next@15.4.6
  - Using traditional `.eslintrc.json` configuration
  - Direct ESLint CLI usage (migrated from `next lint`)

### AI & Data Processing
- **Vercel AI SDK:** 5.0.87 (latest stable v5) with streaming support
- **AI SDK React:** 2.0.87 for React hooks (useChat)
- **AI SDK OpenAI:** 2.0.62 provider
- **AI SDK xAI:** 2.0.31 provider (Grok-3 model)
- **Zod:** 4.1.12 for schema validation
- **nanoid:** 5.1.6 for unique ID generation

### React Compiler Configuration
The project uses the stable React Compiler feature introduced in Next.js 16:
- Automatically memoizes components to reduce unnecessary re-renders
- Configured in `next.config.ts` with `reactCompiler: true`
- No manual `useMemo`, `useCallback`, or `React.memo` optimizations needed in most cases

## Architecture

### AI Agent System

The core of the application is an AI agent (currently using xAI's Grok-3 model) that processes natural language requests and executes tool calls to manage expenses.

**Key Components:**
- **API Route:** `src/app/api/chat/route.ts` - Handles streaming chat responses with tool execution
- **Tool Definitions:** `src/schemas/tools.ts` - Zod schemas for AI tool inputs
- **Tool Executors:** `src/utils/tools.ts` - Implementation of tool actions
- **Data Layer:** `src/utils/expenses.ts` - File-based persistence using JSON

### Tool System Architecture

The AI agent has access to two main grouped tools:

1. **gestionarGasto** (Expense Management)
   - Actions: `crear` (create), `obtener` (get), `modificar` (modify)
   - Handles creating expenses, filtering/querying expenses, and updating existing expenses
   - Supports advanced filtering by category, date ranges

2. **gestionarCategoria** (Category Management)
   - Actions: `crear` (create), `obtener` (get)
   - Manages expense categories with custom colors and emoji icons
   - Default categories: alimentacion, transporte, entretenimiento, salud, educacion, servicios, otros

3. **procesarImagenRecibo** (Receipt Processing) - Currently disabled
   - Planned feature for OCR-based receipt scanning using OpenAI's vision API
   - Code exists but is commented out in route.ts:34-40

### Data Model

**Expense:**
- id (timestamp-based string)
- titulo (description)
- precio (amount)
- categoria (category ID)
- fecha (formatted date in Spanish locale)

**Category:**
- id (kebab-case from nombre)
- nombre (display name)
- color (hex color)
- icono (emoji)
- fechaCreacion (ISO timestamp)

### Data Persistence

Expenses and categories are stored as JSON files in the `data/` directory:
- `data/expenses.json` - All expense records
- `data/categories.json` - Category definitions (auto-initialized with defaults)

The system creates these files automatically on first use. All operations are synchronous file reads/writes.

### Frontend Architecture

- **Chat Interface:** `src/app/chat/page.tsx` - Main conversational UI using `@ai-sdk/react`
- **Markdown Rendering:** Uses `react-markdown` with `remark-gfm` for formatting AI responses
- **Streaming:** Real-time response streaming using Vercel AI SDK's `useChat` hook
- **Transport:** Custom `DefaultChatTransport` for API communication

The UI includes quick action buttons for common tasks and supports streaming responses with proper loading states and error handling.

### Type System

Types are centralized and shared between client and server:
- `src/types/expense.ts` - Core data types (Expense, Category)
- `src/types/tools.ts` - Tool inputs, responses, constants, and validation utilities
- Constants defined for actions (GASTO_ACCIONES, CATEGORIA_ACCIONES) ensure type safety

### AI Model Configuration

Currently uses xAI Grok-3 model (line 9 in route.ts). OpenAI integration code exists but is commented out. The system prompt is in Spanish and instructs the agent on tool usage and response formatting.

**Important Settings:**
- `stopWhen: stepCountIs(4)` - Limits tool execution chains to prevent infinite loops
- System prompt defines Markdown table format for expense displays
- Automatic receipt processing trigger on `[IMAGEN_DATA:base64:mimeType]` pattern (currently disabled)

## Development Notes

- The receipt image processing feature (`procesarImagenRecibo`) exists in code but is disabled in the UI and API route
- UI has placeholder buttons for camera/gallery functionality marked as "En desarrollo"
- All user-facing text and responses are in Spanish
- The agent is configured to format expense tables in Markdown with specific column headers and formatting

## Recent Updates

### AI SDK 5 Upgrade & Code Quality Improvements (2025-11-03)
The project was upgraded to the latest AI SDK v5 with comprehensive code quality improvements:

**AI SDK Updates:**
- `ai@5.0.87` (from 5.0.15) - Latest stable AI SDK v5
- `@ai-sdk/react@2.0.87` (from 2.0.15)
- `@ai-sdk/openai@2.0.62` (from 2.0.15)
- `@ai-sdk/xai@2.0.31` (from 2.0.7)
- `zod@4.1.12` (from 4.0.17) - Updated for AI SDK 5 compatibility

**Tool Definitions Improved:**
- Migrated to AI SDK 5 `tool()` helper function (src/app/api/chat/route.ts)
- Using `inputSchema` with Zod validation
- Better type safety and consistency with SDK patterns

**Type Safety Enhancements:**
- Eliminated ALL `any` types from codebase (src/types/tools.ts)
- Replaced with proper `Expense` and `Category` types
- Removed `@typescript-eslint/no-explicit-any` disable comments
- Full type safety across responses and data structures

**Async/Await Data Layer:**
- Converted all data persistence to async/await (src/utils/expenses.ts)
- Using `fs/promises` instead of synchronous fs operations
- Non-blocking I/O for better performance and scalability
- All tool executors updated to use await properly

**Improved ID Generation:**
- Installed `nanoid@5.1.6` for collision-resistant unique IDs
- Replaced `Date.now().toString()` with `nanoid()`
- Eliminates risk of ID collisions in concurrent operations

**Better Date Handling:**
- Dates now stored as ISO 8601 timestamps (`fecha: new Date().toISOString()`)
- Previously stored as localized Spanish strings
- Enables proper date sorting, filtering, and range queries
- Format to Spanish locale only when displaying to user

**API Route Hardening:**
- Added Zod validation for request body
- Comprehensive try-catch error handling
- Structured error responses with proper HTTP status codes
- Request validation before processing

**Dependencies Cleaned:**
- Removed unused `formidable` and `multer` packages
- Removed `@types/formidable` and `@types/multer`
- Cleaner dependency tree

**Validation:**
- ✅ Build successful with TypeScript strict mode
- ✅ ESLint passes with no errors
- ✅ All types properly inferred
- ✅ Async operations handled correctly

### Next.js 16 Migration (2025-11-03)
The project was successfully upgraded from Next.js 15.4.6 to Next.js 16.0.2-canary.6 with the following changes:

**Bundler & Build:**
- Turbopack is now the default bundler (no `--turbopack` flag needed)
- Build times improved with native Rust-based tooling
- All existing routes compile successfully

**React Compiler:**
- Enabled React Compiler for automatic component memoization
- Added `reactCompiler: true` to `next.config.ts`
- Installed `babel-plugin-react-compiler` dependency

**ESLint Configuration:**
- Migrated from `next lint` to direct ESLint CLI usage
- Changed lint script from `next lint` to `eslint .`
- Using `.eslintrc.json` configuration (traditional format)
- `eslint-config-next@15.4.6` for stable compatibility

**Configuration Files:**
- `next.config.ts`: Added React Compiler configuration
- `.eslintrc.json`: Traditional ESLint config with Next.js presets
- `package.json`: Updated scripts to remove Turbopack flags

**Compatibility Notes:**
- All existing code is compatible with Next.js 16
- No breaking changes required in application code
- API routes, App Router, and streaming all work as expected
