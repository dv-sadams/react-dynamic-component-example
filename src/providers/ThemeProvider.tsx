import { type ReactNode } from "react";
import { themes } from "@/consts/theme";
import { getStore } from "@/helpers/getStore";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { brand } = getStore();
  const themeClass = themes[brand] || themes["base"];
  return <div className={themeClass}>{children}</div>;
};
