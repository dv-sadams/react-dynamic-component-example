import { createTheme } from "@vanilla-extract/css";

import { themeContract } from "@/styles/theme.contract.css";

export const baseTheme = createTheme(themeContract, {
  brand: "blue",
  pageWidth: {
    medium: "1200px",
    large: "1800px",
  },
});
