# Design System - Reglas y Convenciones

Este documento define las reglas y convenciones del Design System del proyecto Expense Tracker.

## Reglas Fundamentales

### 1. Usar `const` en vez de `function`

❌ **Incorrecto:**

```tsx
function MyComponent() {
  return <div>Hello</div>;
}
```

✅ **Correcto:**

```tsx
export const MyComponent = memo(function MyComponent() {
  return <div>Hello</div>;
});
```

**Razón:** Consistencia y mejor integración con `memo()`.

### 2. Nunca usar `export default` (excepto cuando sea necesario)

❌ **Incorrecto:**

```tsx
export default function MyComponent() { ... }
```

✅ **Correcto:**

```tsx
export const MyComponent = memo(function MyComponent() { ... });
```

**Excepciones permitidas:**

- Páginas de Next.js (`page.tsx`, `layout.tsx`, `route.ts`)
- Middleware (`middleware.ts`)
- Archivos de configuración (`next.config.js`, etc.)

### 3. Types y Styles deben ir en archivos específicos

Cada componente que tenga tipos o estilos complejos debe tenerlos en archivos separados.

**Estructura de archivos:**

```
componente/
├── componente.tsx           # Lógica del componente
├── componente.types.ts      # Tipos e interfaces
├── componente.module.css    # Estilos (si los tiene)
└── index.ts                 # Barrel export
```

**Ejemplo:**

```tsx
// ❌ Incorrecto - tipos inline
export const MyComponent = memo(function MyComponent({
  name,
}: {
  name: string;
}) {
  return <div>{name}</div>;
});

// ✅ Correcto - tipos en archivo separado
// my-component.types.ts
export interface MyComponentProps {
  name: string;
}

// my-component.tsx
import type { MyComponentProps } from "./my-component.types";

export const MyComponent = memo(function MyComponent({
  name,
}: MyComponentProps) {
  return <div>{name}</div>;
});
```

### 4. Los UI no deben tener lógica de negocio (deben ser agnósticos)

Los componentes UI deben ser presentacionales y recibir datos/callbacks por props.

❌ **Incorrecto:**

```tsx
export const UserCard = memo(function UserCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then(setUser);
  }, []);

  return <div>{user?.name}</div>;
});
```

✅ **Correcto:**

```tsx
// UI Component (presentational)
export const UserCard = memo(function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>;
});

// Container Component (con lógica)
export const UserCardContainer = memo(function UserCardContainer() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then(setUser);
  }, []);

  if (!user) return null;

  return <UserCard user={user} />;
});
```

### 5. Los componentes SÍ pueden tener lógica de negocio

Los componentes "container" o componentes con estado pueden tener lógica de negocio compleja.

**Separación:**

- **UI Components:** Solo presentación (`/components/ui/`)
- **Feature Components:** Con lógica de negocio (`/components/`)

### 6. Cada componente debe estar en su propio directorio

Cada componente debe tener su propio directorio con sus archivos de types y styles (si los tiene).

**Estructura obligatoria:**

```
src/
├── app/
│   └── chat/
│       └── components/
│           ├── expense-card/
│           │   ├── expense-card.tsx
│           │   ├── expense-card.types.ts
│           │   ├── expense-card.module.css
│           │   └── index.ts
│           └── chat-header/
│               ├── chat-header.tsx
│               └── index.ts
```

### 7. Memoización obligatoria

Todos los componentes deben usar `React.memo` para optimizar renders.

```tsx
export const MyComponent = memo(function MyComponent(props: MyComponentProps) {
  return <div>{props.text}</div>;
});
```

### 8. Hooks personalizados para lógica compleja

La lógica de negocio compleja debe extraerse a custom hooks.

```tsx
// useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // lógica de autenticación
  }, []);

  return { user };
};

// auth-button.tsx
export const AuthButton = memo(function AuthButton() {
  const { user } = useAuth();

  if (!user) return null;

  return <Button>{user.name}</Button>;
});
```

### 9. Nombres descriptivos con funciones nombradas

Siempre usar funciones nombradas (no arrow functions) para mejor debugging.

❌ **Incorrecto:**

```tsx
export const MyComponent = () => <div>Hello</div>;
```

✅ **Correcto:**

```tsx
export const MyComponent = memo(function MyComponent() {
  return <div>Hello</div>;
});
```

### 10. Importaciones tipo-only

Usar `import type` para imports solo de tipos (mejora tree-shaking).

```tsx
import type { User } from "@/types/user";
import type { MyComponentProps } from "./my-component.types";
import { memo } from "react";
```

## Estructura de Archivos Recomendada

```
src/
├── app/
│   ├── chat/
│   │   ├── components/      # Componentes específicos de chat
│   │   ├── hooks/           # Hooks personalizados
│   │   ├── types/           # Tipos compartidos
│   │   ├── utils/           # Utilidades
│   │   └── page.tsx         # Página principal
│   └── ...
├── components/              # Componentes compartidos
│   ├── auth-button/
│   └── ...
├── hooks/                   # Hooks globales
├── types/                   # Tipos globales
└── utils/                   # Utilidades globales
```

## Patrones de Componentes

### UI Component (Presentacional)

```tsx
// button.types.ts
export interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

// button.module.css
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}

.primary {
  background: var(--accent-9);
}

// button.tsx
import { memo } from "react";
import type { ButtonProps } from "./button.types";
import styles from "./button.module.css";

export const Button = memo(function Button({
  onClick,
  children,
  variant = "primary",
}: ButtonProps) {
  return (
    <button onClick={onClick} className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
});

// index.ts
export * from "./button";
export * from "./button.types";
```

### Container Component (Con Lógica)

```tsx
// user-profile.types.ts
export interface UserProfileProps {
  userId: string;
}

// user-profile.tsx
import { memo, useEffect, useState } from "react";
import type { User } from "@/types/user";
import type { UserProfileProps } from "./user-profile.types";
import { UserCard } from "@/components/user-card";

export const UserProfile = memo(function UserProfile({
  userId,
}: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return <UserCard user={user} />;
});
```

## CSS Modules vs Inline Styles

### Cuándo usar CSS Modules

- Estilos complejos con múltiples clases
- Hover, focus, active states
- Animations/transitions
- Media queries

### Cuándo usar Inline Styles

- Estilos dinámicos basados en props
- Valores calculados
- Estilos únicos/excepcionales

## Validación Automática

El proyecto incluye herramientas que validan automáticamente estas reglas:

### ESLint

- Prohibe `export default` (excepto en archivos permitidos)
- Fuerza `import type` para tipos
- Valida orden de imports
- Detecta duplicados

### Prettier

- Formatea código automáticamente
- Mantiene consistencia de estilo

### Husky + lint-staged

- Ejecuta validaciones antes de cada commit
- Auto-fix cuando sea posible

## Scripts Útiles

```bash
# Validar código
yarn lint

# Validar y auto-fix
yarn lint:fix

# Solo formateo
yarn format

# Verificar formateo sin modificar
yarn format:check
```

## Ejemplos Completos

Ver los siguientes componentes como referencia:

- `src/app/chat/components/expense-card/` - Componente con estado y estilos
- `src/app/chat/components/expense-list-header/` - Componente UI simple
- `src/components/auth-button/` - Componente con lógica de negocio

## Recursos Adicionales

- [React Memo Documentation](https://react.dev/reference/react/memo)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Radix UI Themes](https://www.radix-ui.com/themes/docs/overview/getting-started)

## Contribuir

Al agregar nuevos componentes:

1. Crear directorio con nombre en kebab-case
2. Crear archivo `component-name.tsx`
3. Crear archivo `component-name.types.ts` (si tiene props)
4. Crear archivo `component-name.module.css` (si tiene estilos complejos)
5. Crear `index.ts` con barrel exports
6. Seguir todas las reglas de este documento
7. Ejecutar `yarn lint:fix` antes de commit

---

**Última actualización:** Noviembre 2025
