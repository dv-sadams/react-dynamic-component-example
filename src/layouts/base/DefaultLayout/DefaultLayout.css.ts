import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.contract.css";

export const defaultLayout = style({
  maxWidth: vars.pageWidth.medium,
  marginInline: "auto",
  paddingInline: "20px",
});
