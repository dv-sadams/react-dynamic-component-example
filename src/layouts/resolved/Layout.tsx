import { getStore } from "../../helpers/getStore";
import { BaseLayout } from "../base/BaseLayout/Layout";
import { VuseEnLayout } from "../brands/vuse-en/Layout";

export const Layout = (() => {
  const { brand, locale } = getStore();

  switch (`${brand}-${locale}`) {
    case "vuse-en":
      return VuseEnLayout;
    default:
      return BaseLayout;
  }
})();
