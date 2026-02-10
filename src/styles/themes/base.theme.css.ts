import { createTheme } from "@vanilla-extract/css";

import { themeContract } from "@/styles/theme.contract.css";

export const baseTheme = createTheme(themeContract, {
  brand: "blue",
  pageWidth: "1800px",
});
