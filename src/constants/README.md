# Constants Directory

Este directorio centraliza todos los valores hardcodeados del proyecto para mejorar mantenibilidad, consistencia y type-safety.

## Estructura

```
src/constants/
├── routes.ts         # Rutas de la aplicación
├── http-status.ts    # Códigos de estado HTTP
├── api.ts            # Configuración de AI/API
├── database.ts       # Códigos de error de base de datos
├── validation.ts     # Reglas de validación y thresholds
├── categories.ts     # Keywords para categorización
├── index.ts          # Barrel export
└── README.md         # Este archivo
```

## Uso

### Importar constantes

```tsx
// Importar desde el barrel export
import { ROUTES, HTTP_STATUS, AI_CONFIG } from "@/constants";

// O importar desde archivos específicos
import { ROUTES } from "@/constants/routes";
import { HTTP_STATUS } from "@/constants/http-status";
```

### Ejemplos por categoría

#### 1. Rutas (`routes.ts`)

```tsx
import { ROUTES, ROUTE_PREFIXES, PUBLIC_ROUTES } from "@/constants";

// Navegación
router.push(ROUTES.CHAT);
redirect(ROUTES.AUTH_SIGNIN);

// Middleware
if (pathname.startsWith(ROUTE_PREFIXES.AUTH)) {
  // ...
}

// Validación
if (PUBLIC_ROUTES.includes(pathname)) {
  // ...
}
```

#### 2. HTTP Status (`http-status.ts`)

```tsx
import { HTTP_STATUS } from "@/constants";

// API responses
return NextResponse.json(
  { error: "Unauthorized" },
  {
    status: HTTP_STATUS.UNAUTHORIZED,
  }
);

// Error handling
if (response.status === HTTP_STATUS.NOT_FOUND) {
  // ...
}
```

#### 3. API y AI Config (`api.ts`)

```tsx
import {
  AI_CONFIG,
  AI_TOOLS,
  DEFAULT_CATEGORIES,
  OCR_CONFIG,
  FILE_LIMITS,
} from "@/constants";

// AI model
const result = await generateText({
  model: xai(AI_CONFIG.MODEL),
  maxSteps: AI_CONFIG.MAX_STEPS,
});

// Tool names
toolName === AI_TOOLS.GESTIONAR_GASTO;

// Defaults
category: DEFAULT_CATEGORIES.OTROS;

// OCR
const worker = await createWorker(OCR_CONFIG.LANGUAGES);

// File validation
if (file.size > FILE_LIMITS.MAX_SIZE_BYTES) {
  // ...
}
```

#### 4. Database (`database.ts`)

```tsx
import { SUPABASE_ERRORS } from "@/constants";

if (error?.code === SUPABASE_ERRORS.NO_ROWS) {
  // Handle no rows found
}
```

#### 5. Validación (`validation.ts`)

```tsx
import {
  EXPENSE_VALIDATION,
  OCR_THRESHOLDS,
  FILE_VALIDATION,
} from "@/constants";

// Expense validation
if (amount > EXPENSE_VALIDATION.MAX_AMOUNT) {
  throw new Error("Amount too high");
}

if (description.length < EXPENSE_VALIDATION.MIN_DESCRIPTION_LENGTH) {
  // ...
}

// OCR confidence
if (confidence < OCR_THRESHOLDS.MIN_CONFIDENCE) {
  // Request clarification
}

// File upload
if (file.size > FILE_VALIDATION.MAX_SIZE_BYTES) {
  // ...
}
```

#### 6. Categorías (`categories.ts`)

```tsx
import {
  CATEGORY_KEYWORDS,
  FOOD_KEYWORDS,
  TRANSPORT_KEYWORDS,
} from "@/constants";

// Category detection
const detectCategory = (text: string) => {
  if (FOOD_KEYWORDS.some((keyword) => text.includes(keyword))) {
    return "alimentacion";
  }
  // ...
};

// Or use the mapping
Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
  if (keywords.some((keyword) => text.includes(keyword))) {
    return category;
  }
});
```

## Reglas

1. **NUNCA hardcodear valores** - Siempre usar constantes
2. **Agregar nuevas constantes** - Si encuentras un valor hardcodeado, agrégalo aquí
3. **Usar `as const`** - Para type-safety estricto
4. **Documentar** - Agregar comentarios JSDoc cuando sea necesario
5. **Agrupar lógicamente** - Mantener constantes relacionadas juntas

## Agregar nuevas constantes

### 1. Identificar el archivo correcto

- **Rutas** → `routes.ts`
- **HTTP/Status** → `http-status.ts`
- **AI/API/Tools** → `api.ts`
- **Database** → `database.ts`
- **Validación/Límites** → `validation.ts`
- **Keywords/Patterns** → `categories.ts`

### 2. Formato

```tsx
export const MY_CONSTANTS = {
  VALUE_ONE: "value1",
  VALUE_TWO: "value2",
} as const;
```

### 3. Documentar

```tsx
/**
 * Description of what these constants represent
 */
export const MY_CONSTANTS = {
  /** Description of VALUE_ONE */
  VALUE_ONE: "value1",
} as const;
```

### 4. Exportar en index.ts

```tsx
export * from "./my-new-constants";
```

## Type Safety

Las constantes con `as const` generan tipos literales:

```tsx
export const ROUTES = {
  CHAT: "/chat",
} as const;

// Type: "/chat" (not string)
type ChatRoute = typeof ROUTES.CHAT;

// Union of all routes
type Route = (typeof ROUTES)[keyof typeof ROUTES];
// Type: "/chat" | "/auth/signin" | ...
```

## Beneficios

✅ **Mantenibilidad** - Cambios en un solo lugar
✅ **Consistencia** - Valores únicos en toda la app
✅ **Type Safety** - TypeScript infiere tipos automáticamente
✅ **Documentación** - Nombres autodocumentados
✅ **Refactoring** - Búsqueda y reemplazo seguro
✅ **Testing** - Fácil de mockear
✅ **Code Review** - Valores claros y centralizados

## Referencias

- [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md) - Regla #11
- [CLAUDE.md](../../CLAUDE.md) - Coding Standards
