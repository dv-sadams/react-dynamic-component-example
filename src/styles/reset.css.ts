import { globalStyle } from "@vanilla-extract/css";

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
  border: "none",
});

globalStyle(":focus", {
  outline: "none",
  boxShadow: "none",
});

globalStyle(":focus-visible", {
  outline: "2px solid var(--interface-50-focus, Highlight)",
  outlineOffset: "2px",
  boxShadow: "none",
});

globalStyle("button", {
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
});

globalStyle("ol", {
  listStylePosition: "inside",
});

globalStyle("ul", {
  listStyle: "none",
});

globalStyle("a", {
  color: "currentColor",
});
