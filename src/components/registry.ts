import { BaseButton } from "./base/Button/Button";
import { VuseEnButton } from "./brands/vuse-en/Button/Button";

export const componentRegistry = {
  Button: {
    base: BaseButton,
    brands: {
      "vuse-en": VuseEnButton,
    },
  },
};
