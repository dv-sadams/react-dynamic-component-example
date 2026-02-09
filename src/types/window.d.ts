import type { TBrand, TLocale } from "./common";

declare global {
  interface Window {
    Shopify: {
      brand: TBrand;
      locale: TLocale;
    };
  }
}
