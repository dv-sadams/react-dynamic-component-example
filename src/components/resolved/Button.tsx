import { getStore } from "../../helpers/getStore";
import { BaseButton } from "../base/Button/Button";
import { VuseEnButton } from "../brands/vuse-en/Button";

export const Button = (() => {
  const { brand, locale } = getStore();

  switch (`${brand}-${locale}`) {
    case "vuse-en":
      return VuseEnButton;
    default:
      return BaseButton;
  }
})();
