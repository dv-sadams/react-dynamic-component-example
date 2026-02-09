import type { TBrand } from "./common";

declare global {
  interface Window {
    Shopify: {
      brand: TBrand;
    };
  }
}
