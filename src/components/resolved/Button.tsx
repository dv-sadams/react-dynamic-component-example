import { getBrand } from "../../helpers/getBrand";
import { BaseButton } from "../base/Button/Button";
import { VuseButton } from "../brands/vuse/Button";

export const Button = (() => {
  const { brand } = getBrand();

  switch (brand) {
    case "vuse":
      return VuseButton;
    default:
      return BaseButton;
  }
})();
