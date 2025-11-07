# UI Components Library

Esta carpeta contiene componentes UI reutilizables construidos sobre Radix UI Themes.

## Guía de Creación de Componentes

### Estructura Recomendada

```tsx
// src/components/ui/MyComponent.tsx
"use client";

import { Flex, Button, Text } from "@radix-ui/themes";
import { ComponentIcon } from "@radix-ui/react-icons";

interface MyComponentProps {
  title: string;
  onAction: () => void;
  disabled?: boolean;
}

/**
 * MyComponent - Descripción breve del componente
 *
 * @param title - Título del componente
 * @param onAction - Callback cuando se ejecuta la acción
 * @param disabled - Si el componente está deshabilitado
 *
 * @example
 * ```tsx
 * <MyComponent
 *   title="Título"
 *   onAction={() => console.log('clicked')}
 * />
 * ```
 */
export function MyComponent({ title, onAction, disabled = false }: MyComponentProps) {
  return (
    <Flex direction="column" gap="3">
      <Text size="3" weight="bold">
        {title}
      </Text>
      <Button
        onClick={onAction}
        disabled={disabled}
        variant="solid"
      >
        <ComponentIcon />
        Acción
      </Button>
    </Flex>
  );
}
```

### Mejores Prácticas

#### 1. Props API
- ✅ Usa TypeScript para todas las props
- ✅ Proporciona valores por defecto razonables
- ✅ Documenta con JSDoc
- ✅ Usa nombres descriptivos

#### 2. Accesibilidad
- ✅ Incluye ARIA labels cuando sea necesario
- ✅ Usa componentes de Radix (incluyen a11y)
- ✅ Maneja keyboard navigation
- ✅ Proporciona mensajes de error claros

```tsx
// ✅ Bueno
<Button aria-label="Cerrar diálogo">
  <Cross2Icon />
</Button>

// ❌ Malo (sin label para screen readers)
<Button>
  <Cross2Icon />
</Button>
```

#### 3. Composición
- ✅ Prefiere composición sobre props booleanas complejas
- ✅ Usa children cuando sea apropiado
- ✅ Permite customización con style props

```tsx
// ✅ Bueno (composable)
<Card>
  <Flex direction="column" gap="2">
    <Heading>Título</Heading>
    <Text>Contenido</Text>
  </Flex>
</Card>

// ❌ Malo (demasiadas props)
<Card
  showTitle
  title="Título"
  showContent
  content="Contenido"
/>
```

#### 4. Estilos
- ✅ Usa tokens de Radix cuando sea posible
- ✅ Evita estilos inline complejos
- ✅ Usa CSS Modules para casos especiales

```tsx
// ✅ Bueno
<Box p="4" style={{ background: "var(--gray-2)" }}>

// ❌ Malo
<Box style={{ padding: "16px", background: "#f0f0f0" }}>
```

### Componentes para Crear

Sugerencias de componentes útiles para este proyecto:

1. **EmptyState** - Para mostrar cuando no hay datos
2. **LoadingCard** - Card con Skeleton loading
3. **ErrorBoundary** - Manejo de errores UI
4. **ConfirmDialog** - Diálogo de confirmación
5. **Toast** - Notificaciones toast
6. **Badge** - Badges para categorías
7. **StatCard** - Cards de estadísticas

### Testing

```tsx
// Ejemplo de test con jest-axe
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <MyComponent title="Test" onAction={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

Para más información, consulta `docs/design-system.md`
