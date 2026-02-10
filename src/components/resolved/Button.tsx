import { getStore } from "@/helpers/getStore";
import { BaseButton } from "@/components/base/Button/Button";
import { VuseEnButton } from "@/components/brands/vuse-en/Button/Button";

export const Button = (() => {
  const { brand, locale } = getStore();

  switch (`${brand}-${locale}`) {
    case "vuse-en":
      return VuseEnButton;
    default:
      return BaseButton;
  }
})();
