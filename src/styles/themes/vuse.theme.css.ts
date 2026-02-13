import { createTheme } from "@vanilla-extract/css";

import { themeContract } from "@/styles/theme.contract.css";

export const vuseTheme = createTheme(themeContract, {
  brand: "red",
  pageWidth: {
    medium: "1200px",
    large: "1800px",
  },
});
