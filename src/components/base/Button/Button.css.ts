import { vars } from "@/styles/theme.contract.css";
import { recipe } from "@vanilla-extract/recipes";

export const buttonStyle = recipe({
  base: {
    appearance: "none",
    paddingInline: "20px",
    paddingBlock: "10px",
    background: vars.brand,
  },
  variants: {
    brand: {
      base: {},
      glo: {},
      vuse: {
        backgroundColor: "red",
      },
    },
  },
  defaultVariants: {
    brand: "base",
  },
});
