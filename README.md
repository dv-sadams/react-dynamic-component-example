# Multi-Brand Component & Layout Architecture Example

This project demonstrates a scalable component architecture pattern for managing multi-brand applications. It allows you to maintain a single codebase with brand-specific component and layout overrides that are resolved at runtime.

## Architecture Overview

The architecture is based on three core layers:

1. **Base Layer** - Default implementations (components, layouts, etc.)
2. **Brand-Specific Layer** - Brand overrides when customization is needed
3. **Resolved Layer** - Runtime resolution layer that consumers import from

This pattern can be applied to any type of UI element or structure in your application.

```
src/
├── components/
│   ├── base/           # Default component implementations
│   │   └── Button/
│   ├── brands/         # Brand-specific component overrides
│   │   ├── vuse/
│   │   └── vuse-en/
│   └── resolved/       # Runtime-resolved exports (consumer-facing)
├── layouts/
│   ├── base/           # Default layout implementations
│   │   └── BaseLayout/
│   ├── brands/         # Brand-specific layout overrides
│   │   └── vuse-en/
│   └── resolved/       # Runtime-resolved exports (consumer-facing)
├── helpers/
│   └── getStore.ts     # Brand + locale detection
├── contexts/           # React contexts
├── providers/          # Context providers
├── hooks/              # Custom hooks
└── types/              # TypeScript definitions
```

## How It Works

### 1. Base Components

Base components provide the default implementation that works across all brands:

```typescript
// src/components/base/Button/Button.tsx
export const BaseButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button style={buttonStyle} {...rest}>
      {children}
    </button>
  );
};
```

### 2. Brand-Specific Components

Brand components override the base implementation when needed:

```typescript
// src/components/brands/vuse-en/Button.tsx
export const VuseButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return <button {...rest}>{children}</button>;
};
```

### 3. Resolved Components

The resolved layer determines which component to use at runtime:

```typescript
// src/components/resolved/Button.tsx
export const Button = (() => {
  const { brand, locale } = getStore();

  switch (`${brand}-${locale}`) {
    case "vuse-en":
      return VuseEnButton;
    default:
      return BaseButton;
  }
})();
```

### 4. Brand Detection

The `getStore()` helper reads from a global configuration:

```typescript
// src/helpers/getStore.ts
export function getStore() {
  return {
    brand: window.Shopify.brand,
    locale: window.Shopify.locale,
  };
}
```

The brand and locale are typically injected via environment variables or server-side rendering.

## Pattern Extends Beyond Components

The same three-layer architecture applies to any UI structure in your application:

- **Components** - Buttons, cards, modals, forms, etc.
- **Layouts** - Page layouts, grid systems, navigation structures
- **Pages** - Full page templates with brand-specific content
- **Providers** - Context providers with brand-specific logic
- **Hooks** - Custom hooks with brand-specific behavior

## Layouts Follow the Same Pattern

Here's how layouts work with this architecture:

### Base Layout

```typescript
// src/layouts/base/BaseLayout/Layout.tsx
export const BaseLayout = ({ children }: { children: ReactNode }) => {
  return <div className="base-layout">{children}</div>;
};
```

### Brand-Specific Layout

```typescript
// src/layouts/brands/vuse-en/Layout.tsx
export const VuseEnLayout = ({ children }: { children: ReactNode }) => {
  return <div className="vuse-en-layout">{children}</div>;
};
```

### Resolved Layout

```typescript
// src/layouts/resolved/Layout.tsx
export const Layout = (() => {
  const { brand, locale } = getStore();

  switch (`${brand}-${locale}`) {
    case "vuse-en":
      return VuseEnLayout;
    default:
      return BaseLayout;
  }
})();
```

### Usage in Your Application

```typescript
// src/routes/App.tsx
import { Layout } from "../layouts/resolved/Layout";
import { Button } from "../components/resolved/Button";

function App() {
  return (
    <Layout>
      <h1>My App</h1>
      <Button>Click me</Button>
    </Layout>
  );
}
```

## Adding New Components

### Step 1: Create the Base Component

```typescript
// src/components/base/Card/Card.tsx
interface CardProps {
  title: string;
  children: ReactNode;
}

export const BaseCard: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
};
```

### Step 2: Create the Resolved Export

```typescript
// src/components/resolved/Card.tsx
import { getStore } from "../../helpers/getStore";
import { BaseCard } from "../base/Card/Card";
import { VuseCard } from "../brands/vuse-en/Card";

export const Card = (() => {
  const { brand, locale } = getStore();

  switch (`${brand}-${locale}`) {
    case "vuse-en":
      return VuseEnButton;
    default:
      return BaseButton;
  }
})();
```

### Step 3: (Optional) Add Brand Override

```typescript
// src/components/brands/vuse-en/Card.tsx
export const VuseCard: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="vuse-card">
      <h3>{title}</h3>
      <div className="vuse-card-content">{children}</div>
    </div>
  );
};
```

### Step 4: Use in Your Application

```typescript
// src/routes/App.tsx
import { Card } from "../components/resolved/Card";

function App() {
  return <Card title="Example">Content here</Card>;
}
```

## Context and State Management

The project includes a context/provider pattern for shared state:

```typescript
// src/contexts/ExampleContext.ts
export const ExampleContext = createContext<IExampleContext>({
  test: "test",
});

// src/providers/ExampleProvider.tsx
export const ExampleProvider = ({ children }) => {
  const values: IExampleContext = {
    test: "test",
  };

  return <ExampleContext value={values}>{children}</ExampleContext>;
};

// src/hooks/useExample.ts
export const useExample = () => {
  return useContext(ExampleContext);
};
```

## Type System

### Brand Types

```typescript
// src/types/common.d.ts
export type TBrand = "vuse" | "glo";
```

### Window Extensions

```typescript
// src/types/window.d.ts
declare global {
  interface Window {
    Shopify: {
      brand: TBrand;
      locale: string;
    };
  }
}
```

## Benefits of This Architecture

### 1. Single Import Path

Consumers always import from `resolved/`, never needing to know about brands:

```typescript
import { Button } from "../components/resolved/Button";
import { Layout } from "../layouts/resolved/Layout";
```

### 2. Scalability

- Add new brands without changing existing code
- Each brand only needs to override what differs from base
- Base implementations provide sensible defaults
- Pattern applies to components, layouts, and any UI structure

### 3. Type Safety

- Shared TypeScript interfaces ensure consistency
- Brand-specific components must match base component contracts

### 4. Maintainability

- Clear separation between base, brand, and resolved layers
- Easy to see which components have brand overrides
- Centralized brand detection logic

### 5. Performance

- Resolution happens once at module load time (IIFE pattern)
- No runtime overhead for component selection

## Best Practices

### When to Create Brand Overrides

Create brand-specific overrides when:

- Visual design differs significantly
- Behavior needs to change
- Different HTML structure is required
- Locale-specific variations are needed (e.g., `vuse-en` vs `vuse-fr`)

Use base implementations with CSS/theming when:

- Only colors, spacing, or typography differ
- Structure remains the same
- Simple style overrides suffice

### Brand + Locale Pattern

For projects requiring both brand and locale variations, use the combined pattern:

```typescript
// Use getStore()
const { brand, locale } = getStore();

// Create combined keys
switch (`${brand}-${locale}`) {
  case "vuse-en":
    return VuseEnLayout;
  case "vuse-fr":
    return VuseFrLayout;
  default:
    return BaseLayout;
}
```

### Organization Structure

The same structure applies to components, layouts, and any other UI elements:

```
components/ (or layouts/, etc.)
  base/
    ComponentName/
      ComponentName.tsx       # Component logic
      ComponentName.css.ts    # Styles (CSS-in-JS or modules)
      ComponentName.test.tsx  # Tests
      index.ts                # Re-exports

  brands/
    [brand-name]/           # e.g., vuse, vuse-en, glo
      ComponentName.tsx       # Brand override
      ComponentName.css.ts    # Brand-specific styles
      index.ts                # Re-exports

  resolved/
    ComponentName.tsx         # Resolution logic
```

### Naming Conventions

- Base: `Base[Name]` (e.g., `BaseButton`, `BaseLayout`)
- Brand: `[BrandName][Name]` (e.g., `VuseButton`, `VuseEnLayout`)
- Resolved: `[Name]` (consumer-facing, e.g., `Button`, `Layout`)

## Extending to New Brands

### 1. Add Brand Type

```typescript
// src/types/common.d.ts
export type TBrand = "vuse" | "glo" | "velo"; // Add "velo"
```

### 2. Create Brand Directory

```
src/components/brands/velo/
```

### 3. Add Overrides as Needed

Only create overrides for components that differ from base.

### 4. Update Resolution

```typescript
// src/components/resolved/Button.tsx
switch (brand) {
  case "vuse":
    return VuseButton;
  case "velo":
    return VeloButton;
  default:
    return BaseButton;
}
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```
