import { createContext } from "react";
import type { IExampleContext } from "@/types/context";

export const ExampleContext = createContext<IExampleContext>({
  test: "test",
});
