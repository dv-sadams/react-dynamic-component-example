import { BaseLayout } from "./base/DefaultLayout/DefaultLayout";
import { VuseEnDefaultLayout } from "./brands/vuse-en/DefaultLayout/DefaultLayout";

/**
 * Layout registry mapping base layouts to their brand overrides
 *
 * Add new layouts here as you create them:
 * - Import the base layout and any brand overrides
 * - Add an entry with the layout name as the key
 * - Specify base and brands object with override mappings
 */
export const layoutRegistry = {
  DefaultLayout: {
    base: BaseLayout,
    brands: {
      "vuse-en": VuseEnDefaultLayout,
    },
  },
  // Add more layouts here:
  // ProductLayout: {
  //   base: BaseProductLayout,
  //   brands: {
  //     'vuse-en': VuseEnProductLayout,
  //   },
  // },
};
