import { getStore } from "./getStore";

type ComponentMap<T> = {
  base: T;
  brands?: Record<string, T>;
};

export function resolveComponent<T>(componentMap: ComponentMap<T>): T {
  return (() => {
    const { brand, locale } = getStore();
    const key = `${brand}-${locale}`;

    if (componentMap.brands?.[key]) {
      return componentMap.brands[key];
    }

    if (componentMap.brands?.[brand]) {
      return componentMap.brands[brand];
    }

    return componentMap.base;
  })();
}
