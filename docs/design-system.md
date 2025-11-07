# Expense Tracker - Design System

## Resumen

Este proyecto utiliza **Radix UI Themes** como base del design system, proporcionando componentes accesibles, personalizables y consistentes en toda la aplicación.

---

## Configuración del Theme

### Theme Provider

Ubicado en `src/providers/ThemeProvider.tsx`, configura:

- **accentColor**: `indigo` - Color principal para botones, links, elementos interactivos
- **grayColor**: `slate` - Paleta neutral para fondos y texto
- **radius**: `medium` - Escala de border-radius consistente
- **scaling**: `100%` - Escala base de tamaño de fuente y spacing
- **appearance**: `dark` - Modo oscuro por defecto
- **panelBackground**: `solid` - Fondos sólidos para superficies elevadas

### Tokens de Diseño (CSS Variables)

Radix UI proporciona tokens de diseño automáticos accesibles via CSS variables:

```css
/* Colores de acento (indigo) */
--accent-1 to --accent-12    /* Escala de colores de acento */
--accent-9                    /* Color principal de acento */

/* Colores grises (slate) */
--gray-1 to --gray-12        /* Escala de grises */
--gray-2                      /* Fondos claros */
--gray-3                      /* Fondos de contenido */
--gray-6                      /* Bordes */

/* Colores de estado */
--red-9                       /* Errores */
--green-9                     /* Éxito */

/* Espaciado y radius */
--space-1 to --space-9       /* Escala de spacing */
--radius-1 to --radius-6     /* Escala de border-radius */
```

---

## Componentes Migrados

### 1. Layout Components

#### **Flex**
Sistema de flexbox declarativo con props intuitivas.

```tsx
<Flex direction="column" gap="4" align="center" justify="between">
  {children}
</Flex>
```

Props principales:
- `direction`: "row" | "column" | "row-reverse" | "column-reverse"
- `align`: "start" | "center" | "end" | "stretch" | "baseline"
- `justify`: "start" | "center" | "end" | "between"
- `gap`: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
- `wrap`: "nowrap" | "wrap" | "wrap-reverse"

#### **Box**
Contenedor genérico de propósito general.

```tsx
<Box p="4" mb="3" style={{ background: "var(--gray-2)" }}>
  {children}
</Box>
```

Props de spacing:
- `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl` - Padding
- `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml` - Margin

#### **Container**
Contenedor con max-width para layouts centrados.

```tsx
<Container size="1">  {/* size: "1" | "2" | "3" | "4" */}
  {children}
</Container>
```

---

### 2. Typography Components

#### **Heading**
Headings semánticos con escalas de tamaño.

```tsx
<Heading size="7" align="center">
  ¡Bienvenido!
</Heading>
```

Props:
- `size`: "1" a "9" (1 = más pequeño, 9 = más grande)
- `align`: "left" | "center" | "right"
- `weight`: "light" | "regular" | "medium" | "bold"

#### **Text**
Componente de texto con variantes.

```tsx
<Text size="2" weight="medium" color="gray">
  Descripción secundaria
</Text>
```

Props:
- `size`: "1" a "9"
- `weight`: "light" | "regular" | "medium" | "bold"
- `color`: "gray" | "red" | "green" | cualquier color del theme

---

### 3. Interactive Components

#### **Button**
Botón con múltiples variantes y estados.

```tsx
<Button
  size="3"
  variant="solid"  // "solid" | "soft" | "surface" | "outline" | "ghost"
  color="indigo"
  disabled={false}
  loading={false}
>
  <PlusIcon />
  Agregar gasto
</Button>
```

Estados automáticos:
- `:hover` - Efecto hover
- `:active` - Estado presionado
- `:disabled` - Estado deshabilitado
- `:focus-visible` - Focus keyboard

#### **IconButton**
Botón solo con icono.

```tsx
<IconButton size="3" variant="surface">
  <CameraIcon />
</IconButton>
```

#### **TextField**
Input de texto con validación y estados.

```tsx
<TextField.Root
  size="3"
  placeholder="Escribe aquí..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  disabled={false}
/>
```

---

### 4. Feedback Components

#### **Spinner**
Indicador de carga.

```tsx
<Spinner size="3" />  {/* size: "1" | "2" | "3" */}
```

#### **Callout**
Mensajes de alerta/información.

```tsx
<Callout.Root color="red" variant="surface">
  <Callout.Icon>
    <InfoCircledIcon />
  </Callout.Icon>
  <Callout.Text>
    Mensaje de error
  </Callout.Text>
</Callout.Root>
```

Colores disponibles:
- `red` - Errores
- `green` - Éxito
- `blue` - Información
- `yellow` - Advertencias

#### **Skeleton**
Loading placeholder que mantiene el layout.

```tsx
<Skeleton>
  <Avatar size="3" radius="full" fallback="" />
</Skeleton>
```

---

### 5. Data Display Components

#### **Card**
Contenedor elevado para agrupar contenido.

```tsx
<Card size="4">
  <Flex direction="column" gap="3">
    {content}
  </Flex>
</Card>
```

Sizes: "1" | "2" | "3" | "4" | "5"

#### **Avatar**
Componente de avatar con fallback.

```tsx
<Avatar
  size="3"
  radius="full"
  src={imageUrl}
  fallback="JD"
  color="indigo"
/>
```

Props:
- `size`: "1" a "9"
- `radius`: "none" | "small" | "medium" | "large" | "full"
- `src`: URL de imagen
- `fallback`: Texto alternativo (usualmente iniciales)
- `color`: Color del background del fallback

---

### 6. Overlay Components

#### **DropdownMenu**
Menú desplegable accesible.

```tsx
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Button>Abrir menú</Button>
  </DropdownMenu.Trigger>

  <DropdownMenu.Content size="2">
    <DropdownMenu.Item onClick={handleAction}>
      <Flex align="center" gap="2">
        <ExitIcon />
        <Text>Cerrar sesión</Text>
      </Flex>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

Características:
- ✅ Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- ✅ Focus trap automático
- ✅ ARIA attributes completos
- ✅ Portal rendering (evita z-index issues)

---

## Responsive Design

### Breakpoints

Radix UI usa estos breakpoints por defecto:

- `initial`: 0px
- `xs`: 520px
- `sm`: 768px
- `md`: 1024px
- `lg`: 1280px
- `xl`: 1640px

### Uso de Responsive Props

```tsx
// Ocultar en móvil, mostrar en tablet+
<Flex display={{ initial: "none", sm: "flex" }}>
  {content}
</Flex>

// Dirección vertical en móvil, horizontal en desktop
<Flex direction={{ initial: "column", md: "row" }}>
  {content}
</Flex>
```

---

## Accesibilidad

### Keyboard Navigation

Todos los componentes de Radix UI incluyen soporte completo para teclado:

| Componente | Teclas Soportadas |
|------------|-------------------|
| Button | Enter, Space |
| DropdownMenu | Tab, Enter, Escape, Arrow Up/Down |
| TextField | Tab, All text editing keys |
| Dialog | Escape (close), Tab (focus trap) |

### Screen Readers

- **ARIA Labels**: Todos los componentes interactivos incluyen labels apropiados
- **Roles**: Roles semánticos automáticos (button, dialog, menu, etc.)
- **Live Regions**: Spinners y Callouts anuncian cambios

### Focus Management

- **Focus Visible**: Indicadores de focus visibles con `:focus-visible`
- **Focus Trap**: Modals y Dropdowns atrapan focus automáticamente
- **Skip Links**: Considerar agregar skip navigation para mejorar a11y

### Color Contrast

Radix UI garantiza contraste WCAG 2.1 AA:

- Texto sobre fondo: mínimo 4.5:1
- Elementos interactivos: mínimo 3:1
- Texto grande (18px+): mínimo 3:1

---

## Iconos

Usando `@radix-ui/react-icons`:

```tsx
import {
  PlusIcon,
  Cross2Icon,
  CameraIcon,
  PaperPlaneIcon,
  // ... más iconos
} from "@radix-ui/react-icons";

<Button>
  <PlusIcon />
  Agregar
</Button>
```

Iconos disponibles: https://www.radix-ui.com/icons

---

## Ejemplos de Patrones Comunes

### Form con Validación

```tsx
<Flex direction="column" gap="4">
  <TextField.Root
    placeholder="Email"
    type="email"
    required
  />

  {error && (
    <Callout.Root color="red">
      <Callout.Text>{error}</Callout.Text>
    </Callout.Root>
  )}

  <Button type="submit" disabled={isLoading}>
    {isLoading ? <Spinner /> : "Enviar"}
  </Button>
</Flex>
```

### Loading State con Skeleton

```tsx
{isLoading ? (
  <Skeleton>
    <Card size="3">
      <Flex direction="column" gap="3">
        <Text>Placeholder text</Text>
      </Flex>
    </Card>
  </Skeleton>
) : (
  <Card size="3">{actualContent}</Card>
)}
```

### User Dropdown

```tsx
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Flex align="center" gap="2">
      <Text>{user.name}</Text>
      <Avatar src={user.avatar} fallback={user.initials} />
    </Flex>
  </DropdownMenu.Trigger>

  <DropdownMenu.Content>
    <DropdownMenu.Item onClick={handleProfile}>
      Perfil
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item color="red" onClick={handleLogout}>
      Cerrar sesión
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

---

## Extensión del Theme

Para personalizar más allá de los tokens base:

### 1. CSS Custom Properties

```css
/* src/app/globals.css */
:root {
  /* Extender con colores personalizados */
  --custom-gradient: linear-gradient(135deg, var(--indigo-9), var(--purple-9));
}
```

### 2. CSS Modules para Casos Específicos

Cuando necesitas estilos muy personalizados que no encajan en Radix:

```tsx
import styles from "./component.module.css";

<Box className={styles.customCard}>
  {content}
</Box>
```

---

## Migraciones Completadas

### ✅ Componentes Migrados

1. **AuthButton** - De Tailwind classes a DropdownMenu + Avatar de Radix
2. **SignIn Page** - De Tailwind a Flex + Card + Button de Radix
3. **Chat Page** - De CSS Modules + Tailwind a componentes Radix completos
4. **Layout Root** - Integración de ThemeProvider

### ✅ Eliminaciones

- ❌ Todas las Tailwind utility classes removidas
- ❌ CSS inline para layout (reemplazado por Flex/Box props)
- ❌ Custom dropdown CSS (reemplazado por DropdownMenu)

### ✅ Beneficios Logrados

- ✅ **Accesibilidad**: WCAG 2.1 AA compliance automático
- ✅ **Keyboard Navigation**: Completamente funcional en todos los componentes
- ✅ **Consistencia**: Design tokens centralizados y reutilizables
- ✅ **Mantenibilidad**: Menos código custom, más componentes built-in
- ✅ **Type Safety**: Props completamente tipadas con TypeScript
- ✅ **Performance**: Tree-shaking automático, bundle optimizado

---

## Recursos Adicionales

- **Radix Themes Docs**: https://www.radix-ui.com/themes/docs
- **Radix Icons**: https://www.radix-ui.com/icons
- **Color System**: https://www.radix-ui.com/colors
- **Accessibility**: https://www.radix-ui.com/primitives/docs/overview/accessibility

---

## Próximos Pasos Recomendados

1. **Storybook**: Instalar Storybook para documentar componentes interactivamente
2. **Testing**: Agregar tests de accesibilidad con jest-axe o similar
3. **Dark/Light Mode Toggle**: Agregar switch para alternar temas
4. **Custom Components Library**: Crear wrappers personalizados sobre Radix para casos de uso específicos del proyecto

---

*Documentación actualizada: Noviembre 2025*
