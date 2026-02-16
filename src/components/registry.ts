import { BaseButton } from "./base/Button/Button";
import { VuseEnButton } from "./base/Button/brands/vuse-en/Button";

export const componentRegistry = {
  Button: {
    base: BaseButton,
    brands: {
      "vuse-en": VuseEnButton,
    },
  },
};
