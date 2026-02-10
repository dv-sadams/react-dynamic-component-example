import type { ReactNode } from "react";

export const BaseLayout = ({ children }: { children: ReactNode }) => {
  return <div className="base-layout">{children}</div>;
};
