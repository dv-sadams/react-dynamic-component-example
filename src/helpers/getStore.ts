export function getStore() {
  return {
    brand: window.Shopify.brand,
    locale: window.Shopify.locale,
  };
}
