import { type ReactNode } from "react";
import { ExampleContext } from "@/contexts/ExampleContext";
import type { IExampleContext } from "@/types/context";

export const ExampleProvider = ({ children }: { children: ReactNode }) => {
  const values: IExampleContext = {
    test: "test",
  };

  return <ExampleContext value={values}>{children}</ExampleContext>;
};
