import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ExampleProvider } from "./providers/ExampleProvider.tsx";
import { Router } from "./router.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ExampleProvider>
        <Router />
      </ExampleProvider>
    </ThemeProvider>
  </StrictMode>,
);
