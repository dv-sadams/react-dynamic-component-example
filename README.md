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
│   │       ├── Button.tsx
│   │       └── Button.css.ts
│   ├── brands/         # Brand-specific component overrides
│   │   └── vuse-en/
│   │       └── Button/
│   │           ├── Button.tsx
│   │           └── Button.css.ts
│   └── resolved/       # Runtime-resolved exports (consumer-facing)
│       └── Button.tsx
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
│   └── resolved/       # Runtime-resolved exports (consumer-facing)
│       └── DefaultLayout.tsx
├── styles/
│   ├── theme.contract.css.ts  # Theme contract definition
│   ├── themes/
│   │   ├── base.theme.css.ts  # Base theme values
│   │   └── vuse.theme.css.ts  # Vuse theme values
│   └── reset.css.ts
├── helpers/
│   ├── getBrand.ts     # Simple brand detection
│   └── getStore.ts     # Brand + locale detection
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

### 5. Theming with Vanilla Extract

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

### Resolved Layout

```typescript
// src/layouts/resolved/DefaultLayout.tsx
import { getStore } from "@/helpers/getStore";
import { BaseLayout } from "@/layouts/base/DefaultLayout/DefaultLayout";
import { VuseEnDefaultLayout } from "@/layouts/brands/vuse-en/DefaultLayout/DefaultLayout";

export const Layout = (() => {
  const { brand, locale } = getStore();

  switch (`${brand}-${locale}`) {
    case "vuse-en":
      return VuseEnDefaultLayout;
    default:
      return BaseLayout;
  }
})();
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

### Step 2: Create the Resolved Export

```typescript
// src/components/resolved/Card.tsx
import { getStore } from "@/helpers/getStore";
import { BaseCard } from "@/components/base/Card/Card";
import { VuseEnCard } from "@/components/brands/vuse-en/Card/Card";

export const Card = (() => {
  const { brand, locale } = getStore();

  switch (`${brand}-${locale}`) {
    case "vuse-en":
      return VuseEnCard;
    default:
      return BaseCard;
  }
})();
```

### Step 3: (Optional) Add Brand Override

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

### Step 4: Use in Your Application

```typescript
// src/routes/SomePage.tsx
import { Card } from "@/components/resolved/Card";

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

### 1. Single Import Path

Consumers always import from `resolved/`, never needing to know about brands:

```typescript
import { Button } from "@/components/resolved/Button";
import { Layout } from "@/layouts/resolved/DefaultLayout";
```

### 2. Scalability

- Add new brands without changing existing code
- Each brand only needs to override what differs from base
- Base implementations provide sensible defaults
- Pattern applies to components, layouts, and any UI structure

### 3. Type Safety

- Shared TypeScript interfaces ensure consistency
- Brand-specific components must match base component contracts
- Vanilla Extract provides compile-time CSS type safety
- Theme contract ensures type-safe theme values

### 4. Maintainability

- Clear separation between base, brand, and resolved layers
- Easy to see which components have brand overrides
- Centralized brand detection logic
- Co-located styles with components

### 5. Performance

- Resolution happens once at module load time (IIFE pattern)
- No runtime overhead for component selection
- Vanilla Extract generates zero-runtime CSS
- Automatic CSS optimization and minification

### 6. Developer Experience

- IntelliSense for theme variables
- Type-safe styling
- Hot module replacement works seamlessly
- Path aliases (`@/`) for clean imports

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

  resolved/
    ComponentName.tsx         # Resolution logic (no folder)
```

**Key Points:**

- Both base and brand components are in their own folders
- Each folder contains co-located `.tsx` and `.css.ts` files
- Resolved exports are single files (no folder needed)
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
