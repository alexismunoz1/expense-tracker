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
  - **Tesseract.js Compatibility:** Configured via `serverExternalPackages: ['tesseract.js']` in next.config.ts
  - Empty `turbopack: {}` config required for proper initialization
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
- **Tesseract.js:** 6.0.1 for OCR (Optical Character Recognition) on receipt images

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

The AI agent has access to three main grouped tools:

1. **gestionarGasto** (Expense Management)
   - Actions: `crear` (create), `obtener` (get), `modificar` (modify)
   - Handles creating expenses, filtering/querying expenses, and updating existing expenses
   - Supports advanced filtering by category, date ranges

2. **gestionarCategoria** (Category Management)
   - Actions: `crear` (create), `obtener` (get)
   - Manages expense categories with custom colors and emoji icons
   - Default categories: alimentacion, transporte, entretenimiento, salud, educacion, servicios, otros

3. **procesarImagenRecibo** (Receipt Processing) - ✅ Active
   - OCR-based receipt scanning using Tesseract.js
   - Extracts text from images (español + inglés language models)
   - Automatically detects amounts, descriptions, and infers categories
   - **Smart Expense Creation:** Conditionally creates expenses based on description clarity
   - **User Clarification Flow:** Prompts user for descriptive name when OCR description is unclear
   - **Clarity Validation:** Uses `isDescriptionUnclear()` to check description quality (src/utils/tools.ts)
   - **Criteria for Unclear Descriptions:**
     - Description length < 5 characters
     - Generic fallback text ("Gasto detectado en recibo")
     - OCR confidence < 75%
   - Integrated in route.ts with image filtering via `removeImagesFromMessages()` helper

### Data Model

**Expense:**
- id (nanoid-generated unique ID)
- titulo (description)
- precio (amount)
- categoria (category ID)
- fecha (ISO 8601 timestamp)

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

The system creates these files automatically on first use. All operations use async/await with `fs/promises` for non-blocking I/O.

### Frontend Architecture

- **Chat Interface:** `src/app/chat/page.tsx` - Main conversational UI using `@ai-sdk/react`
- **Markdown Rendering:** Uses `react-markdown` with `remark-gfm` for formatting AI responses
- **Streaming:** Real-time response streaming using Vercel AI SDK's `useChat` hook
- **Transport:** Custom `DefaultChatTransport` for API communication

The UI includes quick action buttons for common tasks and supports streaming responses with proper loading states and error handling.

### Type System

Types are centralized and shared between client and server:
- `src/types/expense.ts` - Core data types (Expense, Category)
- `src/types/tools.ts` - Tool inputs, responses, constants, validation utilities, and OCR types
  - `ExtractedOcrData` - Structured OCR extraction results (amount, description, category, confidence)
  - `OcrResult` - Complete OCR processing result with clarification flags
  - `isDescriptionUnclear()` - Validation function for description quality assessment
- Constants defined for actions (GASTO_ACCIONES, CATEGORIA_ACCIONES) ensure type safety

### AI Model Configuration

Currently uses xAI Grok-3 model. OpenAI integration code exists but is commented out. The system prompt is in Spanish and instructs the agent on tool usage and response formatting.

**Important Settings:**
- `stopWhen: stepCountIs(4)` - Limits tool execution chains to prevent infinite loops
- System prompt defines Markdown table format for expense displays
- **Dynamic System Prompt Enrichment:** When OCR requires clarification, system prompt is enhanced with extracted data context
- **Image Filtering:** `removeImagesFromMessages()` helper removes images from message history before sending to Grok-3
- Automatic receipt processing: Images uploaded via UI are processed with Tesseract OCR before AI model interaction
- Grok-3 model receives only text (no image support), OCR results are injected as assistant message

**Error Handling:**
- API route always returns stream response (even on errors) to prevent `useChat` status getting stuck in "submitted" state
- Errors are streamed as chat messages for better UX instead of blocking UI with JSON responses

## Development Notes

- The receipt image processing feature (`procesarImagenRecibo`) is **fully functional** with Tesseract.js OCR
- **Smart Clarification System:** OCR automatically detects unclear descriptions and prompts users for clarification before creating expenses
- UI includes working camera/gallery buttons for image upload (lines 58-65, 220-236 in chat/page.tsx)
- All user-facing text and responses are in Spanish
- The agent is configured to format expense tables in Markdown with specific column headers and formatting
- OCR processing happens server-side in Node.js environment (not browser-based)
- Images are filtered from message history before being sent to Grok-3 model (which doesn't support image inputs)

## Recent Updates

### User Clarification for Unclear Receipts & Turbopack Fixes (2025-11-04)
Implemented intelligent receipt processing with user clarification and fixed critical Tesseract.js compatibility issues with Next.js 16 + Turbopack.

**Smart User Clarification System:**
- **New Types (src/types/tools.ts):**
  - `ExtractedOcrData` - Structured OCR extraction results with amount, description, category, and confidence
  - `OcrResult` - Complete OCR result including `requiresClarification` flag and extracted data
  - `isDescriptionUnclear()` - Validation function checking description quality
- **Conditional Expense Creation (src/utils/tools.ts):**
  - Modified `executeProcesarImagenRecibo()` to evaluate description clarity before creating expense
  - If description is clear: Creates expense automatically (preserves existing behavior)
  - If description is unclear: Returns result with `requiresClarification: true`, prompts user for descriptive name
  - If user doesn't respond to clarification request: Expense is not created (prevents low-quality data)
- **Clarity Criteria:**
  - Description length < 5 characters
  - Generic fallback text ("Gasto detectado en recibo")
  - OCR confidence < 75%

**Enhanced API Route (src/app/api/chat/route.ts):**
- **Dynamic System Prompt Enrichment:** When `requiresClarification` flag is true, enriches system prompt with extracted OCR data (amount, category, confidence)
- **Image Filtering Helper:** Added `removeImagesFromMessages()` utility function to filter image content from message history
  - Prevents "Image inputs are not supported by this model" errors with Grok-3
  - Allows images to remain in conversation history without breaking AI model calls
- **Improved Error Handling:** API route now returns stream response even on errors (instead of JSON)
  - Fixes issue where `useChat` status would get stuck in "submitted" state
  - Errors appear as chat messages for better UX

**Next.js 16 + Turbopack Compatibility (next.config.ts):**
- **Critical Fix:** Added `serverExternalPackages: ['tesseract.js']` configuration
  - Marks Tesseract.js as external package for Turbopack bundler
  - Resolves: `Cannot find module '/ROOT/node_modules/tesseract.js/src/worker-script/node/index.js'`
  - Fixes OCR processing failures that caused frontend to hang on "Procesando..."
- **Turbopack Config:** Added empty `turbopack: {}` object required for Next.js 16 initialization
- **Simplified Worker Configuration:** Removed manual `workerPath` configuration (Tesseract auto-resolves correctly now)
- **Removed Webpack Config:** Deleted incompatible webpack configuration (Turbopack is the default bundler)

**User Flow:**
1. User uploads receipt image via camera/gallery button
2. Server processes image with Tesseract OCR, extracts text
3. System evaluates description clarity with `isDescriptionUnclear()`
4. **If clear:** Expense created automatically, confirmation message sent
5. **If unclear:** AI agent asks user for descriptive name with context (amount, suggested category, confidence)
6. User provides description, expense created with user-provided name
7. Images filtered from messages before sending to Grok-3 model

**Validation:**
- ✅ Tesseract.js initializes without worker path errors in Next.js 16 + Turbopack
- ✅ OCR processing completes successfully without frontend hanging
- ✅ Description clarity validation working as expected
- ✅ User clarification flow functional end-to-end
- ✅ Grok-3 receives only text (no image input errors)
- ✅ `useChat` status properly transitions from "submitted" to "ready" on all responses

### Tesseract.js OCR Integration & Receipt Processing (2025-11-04)
Full implementation of receipt image processing using Tesseract.js OCR with critical fixes for Next.js 16 compatibility:

**Tesseract.js Installation & Configuration:**
- Installed `tesseract.js@6.0.1` for server-side OCR processing
- Configured dual-language support (español + inglés) for better text extraction
- Implemented custom worker path resolution for Next.js 16 + Turbopack compatibility

**Critical Fixes for Next.js 16 Compatibility:**

1. **Worker Path Resolution (src/utils/tools.ts:505-507)**
   - **Issue:** Next.js 16 with Turbopack couldn't auto-resolve tesseract.js worker module
   - **Error:** `Cannot find module '/ROOT/node_modules/tesseract.js/src/worker-script/node/index.js'`
   - **Solution:** Explicit workerPath configuration using `path.join(process.cwd(), "node_modules/...")`
   - Required `import path from "path"` for proper path resolution

2. **RegExp Global Flags (src/utils/tools.ts:338-344)**
   - **Issue:** `String.prototype.matchAll` requires global RegExp patterns
   - **Error:** `matchAll called with a non-global RegExp argument`
   - **Solution:** Added `g` flag to all regex patterns in `extractAmount()` function
   - Enhanced patterns to detect "monto" keyword and handle various number formats

3. **Grok-3 Image Input Limitation (src/app/api/chat/route.ts:81-88)**
   - **Issue:** xAI Grok-3 model doesn't support image inputs
   - **Error:** `Image inputs are not supported by this model`
   - **Solution:** Process image with Tesseract first, then send only OCR text results to AI model
   - Removed image from model messages, keeping only text content

**OCR Implementation Features:**
- Automatic text extraction from receipt images with progress tracking
- Smart amount parsing with support for multiple currency formats ($, €)
- Category inference based on keywords in extracted text
- Description extraction from receipt header/merchant name
- Confidence level calculation based on Tesseract accuracy
- Automatic expense creation after successful OCR
- Comprehensive error handling with user-friendly messages

**Image Upload Flow:**
- Frontend: Camera/gallery buttons trigger file input (src/app/chat/page.tsx:58-65, 220-236)
- Image preview with ability to clear selection before sending
- Base64 encoding for API transmission
- Server-side OCR processing in Node.js worker threads
- Results streamed back to user with expense details

**Performance:**
- OCR processing typically completes in 2-3 seconds
- Language files auto-downloaded from CDN on first use
- Worker properly terminated after processing to free resources

**Validation:**
- ✅ Tesseract worker initializes correctly with custom path
- ✅ OCR extracts text with ~89% confidence on test receipts
- ✅ Amount parsing handles various formats (17.400, $17.400, etc.)
- ✅ Grok-3 model receives only text (no image input errors)
- ✅ Expenses created automatically from receipt data

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
