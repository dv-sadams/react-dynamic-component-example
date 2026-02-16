import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.contract.css";

export const buttonClass = style({
  appearance: "none",
  paddingInline: "20px",
  paddingBlock: "10px",
  background: vars.brand,
});
