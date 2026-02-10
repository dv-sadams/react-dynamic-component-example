# Multi-Brand Component Architecture Example

This project demonstrates a scalable component architecture pattern for managing multi-brand applications. It allows you to maintain a single codebase with brand-specific component overrides that are resolved at runtime.

## Architecture Overview

The architecture is based on three core layers:

1. **Base Components** - Default component implementations
2. **Brand-Specific Components** - Brand overrides when customization is needed
3. **Resolved Components** - Runtime resolution layer that consumers import from

```
src/
├── components/
│   ├── base/           # Default implementations
│   │   └── Button/
│   ├── brands/         # Brand-specific overrides
│   │   ├── vuse/
│   │   └── glo/
│   └── resolved/       # Runtime-resolved exports (consumer-facing)
├── helpers/
│   └── getStore.ts     # Brand detection utility
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
// src/components/brands/vuse/Button.tsx
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

The brand is typically injected via environment variables or server-side rendering.

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
import { VuseCard } from "../brands/vuse/Card";

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
// src/components/brands/vuse/Card.tsx
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
    };
  }
}
```

## Benefits of This Architecture

### 1. Single Import Path

Consumers always import from `resolved/`, never needing to know about brands:

```typescript
import { Button } from "../components/resolved/Button";
```

### 2. Scalability

- Add new brands without changing existing code
- Each brand only needs to override components that differ
- Base components provide sensible defaults

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

Create brand-specific components when:

- Visual design differs significantly
- Behavior needs to change
- Different HTML structure is required

Use base components with CSS/theming when:

- Only colors, spacing, or typography differ
- Structure remains the same
- Simple style overrides suffice

### Component Organization

```
base/
  ComponentName/
    ComponentName.tsx       # Component logic
    ComponentName.css.ts    # Styles (CSS-in-JS or modules)
    ComponentName.test.tsx  # Tests
    index.ts                # Re-exports

brands/
  [brand-name]/
    ComponentName.tsx       # Brand override
    ComponentName.css.ts    # Brand-specific styles
    index.ts                # Re-exports

resolved/
  ComponentName.tsx         # Resolution logic
```

### Naming Conventions

- Base: `Base[ComponentName]`
- Brand: `[BrandName][ComponentName]` (e.g., `VuseButton`)
- Resolved: `[ComponentName]` (consumer-facing)

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
