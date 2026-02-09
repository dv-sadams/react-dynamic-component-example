import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css";
import App from "./routes/App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { ExampleProvider } from "./providers/ExampleProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ExampleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ExampleProvider>
  </StrictMode>,
);
