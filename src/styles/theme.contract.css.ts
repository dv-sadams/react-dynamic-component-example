import "./reset.css";
import { createThemeContract } from "@vanilla-extract/css";

export const themeContract = createThemeContract({
  brand: null,
  pageWidth: {
    medium: null,
    large: null,
  },
});

export { themeContract as vars } from "@/styles/theme.contract.css";
