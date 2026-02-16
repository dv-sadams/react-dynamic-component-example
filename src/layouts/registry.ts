import { BaseLayout } from "./base/DefaultLayout/DefaultLayout";
import { VuseEnDefaultLayout } from "./base/DefaultLayout/brands/vuse-en/DefaultLayout";

export const layoutRegistry = {
  DefaultLayout: {
    base: BaseLayout,
    brands: {
      "vuse-en": VuseEnDefaultLayout,
    },
  },
};
