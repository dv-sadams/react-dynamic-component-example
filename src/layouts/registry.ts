import { BaseLayout } from "./base/DefaultLayout/DefaultLayout";
import { VuseEnDefaultLayout } from "./brands/vuse-en/DefaultLayout/DefaultLayout";

export const layoutRegistry = {
  DefaultLayout: {
    base: BaseLayout,
    brands: {
      "vuse-en": VuseEnDefaultLayout,
    },
  },
};
