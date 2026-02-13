# Multi-Brand Component & Layout Architecture Example

This project demonstrates a scalable component architecture pattern for managing multi-brand applications. It allows you to maintain a single codebase with brand-specific component and layout overrides that are resolved at runtime.

## Architecture Overview

The architecture is based on three core layers with automatic resolution:

1. **Base Layer** - Default implementations (components, layouts, etc.)
2. **Brand-Specific Layer** - Brand overrides when customization is needed
3. **Automatic Resolution** - Registry-based resolution with barrel exports

This pattern can be applied to any type of UI element or structure in your application.

```
src/
├── components/
│   ├── base/           # Default component implementations
│   │   └── Button/
│   │       ├── Button.tsx
│   │       └── Button.css.ts
│   ├── brands/         # Brand-specific component overrides
│   │   └── vuse-en/
│   │       └── Button/
│   │           ├── Button.tsx
│   │           └── Button.css.ts
│   ├── registry.ts     # Component registry (maps base → brand overrides)
│   └── index.ts        # Barrel export (consumer-facing)
├── layouts/
│   ├── base/           # Default layout implementations
│   │   └── DefaultLayout/
│   │       ├── DefaultLayout.tsx
│   │       └── DefaultLayout.css.ts
│   ├── brands/         # Brand-specific layout overrides
│   │   └── vuse-en/
│   │       └── DefaultLayout/
│   │           ├── DefaultLayout.tsx
│   │           └── DefaultLayout.css.ts
│   ├── registry.ts     # Layout registry (maps base → brand overrides)
│   └── index.ts        # Barrel export (consumer-facing)
├── styles/
│   ├── theme.contract.css.ts  # Theme contract definition
│   ├── themes/
│   │   ├── base.theme.css.ts  # Base theme values
│   │   └── vuse.theme.css.ts  # Vuse theme values
│   └── reset.css.ts
├── helpers/
│   ├── getStore.ts         # Brand + locale detection
│   └── resolveComponent.ts # Automatic component resolver
├── contexts/           # React contexts
├── providers/          # Context providers (ThemeProvider, etc.)
├── consts/             # Constants (theme mappings, etc.)
├── hooks/              # Custom hooks
└── types/              # TypeScript definitions
```

## How It Works

### 1. Base Components

Base components provide the default implementation with vanilla-extract styling:

```typescript
// src/components/base/Button/Button.tsx
export const BaseButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button className={buttonStyle} {...rest}>
      {children}
    </button>
  );
};
```

```typescript
// src/components/base/Button/Button.css.ts
import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.contract.css";

export const buttonStyle = style({
  appearance: "none",
  paddingInline: "20px",
  paddingBlock: "10px",
  background: vars.brand,
});
```

### 2. Brand-Specific Components

Brand components override the base implementation when needed:

```typescript
// src/components/brands/vuse-en/Button/Button.tsx
export const VuseEnButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button className={buttonClass} {...rest}>
      {children}
    </button>
  );
};
```

```typescript
// src/components/brands/vuse-en/Button/Button.css.ts
import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.contract.css";

export const buttonClass = style({
  appearance: "none",
  paddingInline: "20px",
  paddingBlock: "10px",
  background: vars.brand,
});
```

### 3. Component Registry

The registry maps base components to their brand-specific overrides:

```typescript
// src/components/registry.ts
import { BaseButton } from "./base/Button/Button";
import { VuseEnButton } from "./brands/vuse-en/Button/Button";

export const componentRegistry = {
  Button: {
    base: BaseButton,
    brands: {
      "vuse-en": VuseEnButton,
    },
  },
};
```

### 4. Automatic Resolution

The resolver automatically selects the correct component based on brand-locale:

```typescript
// src/helpers/resolveComponent.ts
export function resolveComponent<T>(componentMap: ComponentMap<T>): T {
  return (() => {
    const { brand, locale } = getStore();
    const key = `${brand}-${locale}`;

    // Try brand-locale specific (e.g., "vuse-en")
    if (componentMap.brands?.[key]) {
      return componentMap.brands[key];
    }

    // Try brand-only (e.g., "vuse")
    if (componentMap.brands?.[brand]) {
      return componentMap.brands[brand];
    }

    // Fallback to base
    return componentMap.base;
  })();
}
```

### 5. Barrel Export

The barrel file uses the resolver to export the correct component:

```typescript
// src/components/index.ts
import { resolveComponent } from "@/helpers/resolveComponent";
import { componentRegistry } from "./registry";

export const Button = resolveComponent(componentRegistry.Button);
```

### 6. Brand Detection

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

### 7. Theming with Vanilla Extract

This project uses [Vanilla Extract](https://vanilla-extract.style/) for type-safe, zero-runtime CSS-in-TypeScript styling.

**Theme Contract** - Defines the shape of your theme:

```typescript
// src/styles/theme.contract.css.ts
import { createThemeContract } from "@vanilla-extract/css";

export const themeContract = createThemeContract({
  brand: null,
  pageWidth: null,
});

export { themeContract as vars };
```

**Theme Implementations** - Define brand-specific values:

```typescript
// src/styles/themes/base.theme.css.ts
import { createTheme } from "@vanilla-extract/css";
import { themeContract } from "@/styles/theme.contract.css";

export const baseTheme = createTheme(themeContract, {
  brand: "blue",
  pageWidth: "1800px",
});

// src/styles/themes/vuse.theme.css.ts
export const vuseTheme = createTheme(themeContract, {
  brand: "red",
  pageWidth: "1200px",
});
```

**Theme Provider** - Applies the correct theme at runtime:

```typescript
// src/providers/ThemeProvider.tsx
import { themes } from "@/consts/theme";
import { getStore } from "@/helpers/getStore";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { brand } = getStore();
  const themeClass = themes[brand] || themes["base"];
  return <div className={themeClass}>{children}</div>;
};
```

**Using Theme Variables** - Reference theme values in your styles:

```typescript
// Any .css.ts file
import { vars } from "@/styles/theme.contract.css";

export const myStyle = style({
  background: vars.brand, // Uses theme color
  maxWidth: vars.pageWidth, // Uses theme layout value
});
```

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
// src/layouts/base/DefaultLayout/DefaultLayout.tsx
import { Outlet } from "react-router";
import { defaultLayout } from "./DefaultLayout.css";

export const BaseLayout = () => {
  return (
    <div className={defaultLayout}>
      <Outlet />
    </div>
  );
};
```

```typescript
// src/layouts/base/DefaultLayout/DefaultLayout.css.ts
import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.contract.css";

export const defaultLayout = style({
  maxWidth: vars.pageWidth,
  marginInline: "auto",
  paddingInline: "20px",
});
```

### Brand-Specific Layout

```typescript
// src/layouts/brands/vuse-en/DefaultLayout/DefaultLayout.tsx
import { Outlet } from "react-router";
import { defaultLayout } from "./DefaultLayout.css";

export const VuseEnDefaultLayout = () => {
  return (
    <div className={defaultLayout}>
      <Outlet />
    </div>
  );
};
```

```typescript
// src/layouts/brands/vuse-en/DefaultLayout/DefaultLayout.css.ts
import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.contract.css";

export const defaultLayout = style({
  maxWidth: vars.pageWidth, // Uses vuse-specific pageWidth
  marginInline: "auto",
  paddingInline: "16px", // Different padding for vuse-en
});
```

### Layout Registry & Barrel Export

Layouts use the same registry pattern:

```typescript
// src/layouts/registry.ts
import { BaseLayout } from "./base/DefaultLayout/DefaultLayout";
import { VuseEnDefaultLayout } from "./brands/vuse-en/DefaultLayout/DefaultLayout";

export const layoutRegistry = {
  DefaultLayout: {
    base: BaseLayout,
    brands: {
      "vuse-en": VuseEnDefaultLayout,
    },
  },
};
```

```typescript
// src/layouts/index.ts
import { resolveComponent } from "@/helpers/resolveComponent";
import { layoutRegistry } from "./registry";

export const DefaultLayout = resolveComponent(layoutRegistry.DefaultLayout);
```

## Adding New Components

### Step 1: Create the Base Component

Create a folder for your component with both logic and styles:

```typescript
// src/components/base/Card/Card.tsx
import { cardContainer, cardTitle } from "./Card.css";

interface CardProps {
  title: string;
  children: ReactNode;
}

export const BaseCard: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className={cardContainer}>
      <h2 className={cardTitle}>{title}</h2>
      <div>{children}</div>
    </div>
  );
};
```

```typescript
// src/components/base/Card/Card.css.ts
import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.contract.css";

export const cardContainer = style({
  border: `1px solid ${vars.brand}`,
  padding: "20px",
  borderRadius: "8px",
});

export const cardTitle = style({
  color: vars.brand,
  fontSize: "1.5rem",
});
```

### Step 2: Register in Component Registry

Add your component to the registry:

```typescript
// src/components/registry.ts
import { BaseButton } from "./base/Button/Button";
import { VuseEnButton } from "./brands/vuse-en/Button/Button";
import { BaseCard } from "./base/Card/Card";  // Add this

export const componentRegistry = {
  Button: {
    base: BaseButton,
    brands: {
      "vuse-en": VuseEnButton,
    },
  },
  Card: {  // Add this entry
    base: BaseCard,
    brands: {
      // Add brand overrides here when needed
    },
  },
};
```

### Step 3: Export from Barrel

Add the component export to the barrel:

```typescript
// src/components/index.ts
import { resolveComponent } from "@/helpers/resolveComponent";
import { componentRegistry } from "./registry";

export const Button = resolveComponent(componentRegistry.Button);
export const Card = resolveComponent(componentRegistry.Card);  // Add this
```

### Step 4: (Optional) Add Brand Override

Only create if the brand needs different structure or behavior:

```typescript
// src/components/brands/vuse-en/Card/Card.tsx
import { cardContainer, cardTitle } from "./Card.css";

export const VuseEnCard: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className={cardContainer}>
      <h3 className={cardTitle}>{title}</h3>
      <div className="content">{children}</div>
    </div>
  );
};
```

```typescript
// src/components/brands/vuse-en/Card/Card.css.ts
import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.contract.css";

export const cardContainer = style({
  border: `2px solid ${vars.brand}`,
  padding: "16px",
  borderRadius: "4px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
});

export const cardTitle = style({
  color: vars.brand,
  fontSize: "1.25rem",
  fontWeight: "bold",
});
```

Then update the registry to include the brand override:

```typescript
// src/components/registry.ts
import { VuseEnCard } from "./brands/vuse-en/Card/Card";  // Import brand override

export const componentRegistry = {
  // ... other components
  Card: {
    base: BaseCard,
    brands: {
      "vuse-en": VuseEnCard,  // Add brand override here
    },
  },
};
```

### Step 5: Use in Your Application

```typescript
// src/routes/SomePage.tsx
import { Card } from "@/components";  // Import from barrel

function SomePage() {
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

### 1. Clean Import Paths

Consumers always import from barrel files, never needing to know about brands:

```typescript
import { Button } from "@/components";
import { DefaultLayout } from "@/layouts";
```

### 2. Automatic Resolution

- No manual switch statements for each component
- Registry-based lookup with automatic fallback chain
- Tries: `brand-locale` → `brand` → `base`
- Type-safe component resolution with generics
- 90% less boilerplate code

### 3. Scalability

- Add new brands by updating registry only
- Each brand only needs to override what differs from base
- Base implementations provide sensible defaults
- Pattern applies to components, layouts, and any UI structure
- No need to modify barrel exports when adding brands

### 4. Type Safety

- Shared TypeScript interfaces ensure consistency
- Brand-specific components must match base component contracts
- Vanilla Extract provides compile-time CSS type safety
- Theme contract ensures type-safe theme values
- Generic resolver ensures component type consistency

### 5. Maintainability

- Clear separation between base, brand, and registry layers
- All component mappings visible in one registry file
- Centralized brand detection logic
- Co-located styles with components
- Self-documenting registry shows all overrides at a glance

### 6. Performance

- Resolution happens once at module load time (IIFE pattern)
- No runtime overhead for component selection
- Vanilla Extract generates zero-runtime CSS
- Automatic CSS optimization and minification
- Tree-shaking works with barrel exports

### 7. Developer Experience

- IntelliSense for theme variables
- Type-safe styling
- Hot module replacement works seamlessly
- Path aliases (`@/`) for clean imports
- Easy to see which components have brand overrides

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
      ComponentName.css.ts    # Vanilla Extract styles
      ComponentName.test.tsx  # Tests (optional)
      index.ts                # Re-exports (optional)

  brands/
    [brand-locale]/           # e.g., vuse-en, vuse-fr, glo-en
      ComponentName/
        ComponentName.tsx       # Brand override logic
        ComponentName.css.ts    # Brand-specific styles
        index.ts                # Re-exports (optional)

  registry.ts                 # Component registry (maps base → brands)
  index.ts                    # Barrel export with automatic resolution
```

**Key Points:**

- Both base and brand components are in their own folders
- Each folder contains co-located `.tsx` and `.css.ts` files
- Registry file centralizes all component mappings
- Barrel export uses resolver for automatic brand selection
- Use path aliases (`@/`) for cleaner imports

### Naming Conventions

- Base: `Base[Name]` (e.g., `BaseButton`, `BaseLayout`)
- Brand: `[BrandName][Name]` (e.g., `VuseEnButton`, `VuseEnDefaultLayout`)
- Resolved: `[Name]` (consumer-facing, e.g., `Button`, `Layout`)
- CSS exports: Descriptive names (e.g., `buttonStyle`, `cardContainer`)

## Extending to New Brands

### 1. Add Brand Type

```typescript
// src/types/common.d.ts
export type TBrand = "vuse" | "glo" | "velo"; // Add "velo"
```

### 2. Create Brand Directory

```
src/components/brands/velo-en/
```

### 3. Add Overrides as Needed

Only create overrides for components that differ from base.

```typescript
// src/components/brands/velo-en/Button/Button.tsx
export const VeloEnButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button className={buttonClass} {...rest}>
      {children}
    </button>
  );
};
```

### 4. Update Registry Only

No need to touch barrel exports or resolved files! Just update the registry:

```typescript
// src/components/registry.ts
import { VeloEnButton } from "./brands/velo-en/Button/Button";

export const componentRegistry = {
  Button: {
    base: BaseButton,
    brands: {
      "vuse-en": VuseEnButton,
      "velo-en": VeloEnButton,  // Just add this line!
    },
  },
  // Other components...
};
```

That's it! The resolver automatically handles the new brand.

## Vanilla Extract Setup

This project uses Vanilla Extract for type-safe CSS. Here's what you need:

### Installation

```bash
npm install @vanilla-extract/css
npm install --save-dev @vanilla-extract/vite-plugin
```

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
});
```

### File Naming Convention

- All style files must use the `.css.ts` extension
- Co-locate styles with components: `Button.tsx` + `Button.css.ts`
- Use descriptive export names for styles

### Best Practices

1. **Use Theme Variables** - Always reference theme contract vars for consistency
2. **Type Safety** - Leverage TypeScript for style values
3. **Co-location** - Keep styles with their components
4. **Naming** - Use camelCase for style exports (e.g., `buttonStyle`, `cardContainer`)

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

### Key Technologies

- **React 19** - UI framework with modern features
- **TypeScript** - Type safety throughout the codebase
- **Vanilla Extract** - Zero-runtime, type-safe CSS-in-TypeScript
- **Vite** - Fast build tool with HMR
- **React Router** - For navigation and routing

Use this pattern when building applications that need to support multiple brands, white-labels, or themes while maintaining a single codebase with type-safe styling and optimal performance.
