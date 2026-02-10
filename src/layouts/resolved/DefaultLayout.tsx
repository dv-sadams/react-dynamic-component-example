import { getStore } from "@/helpers/getStore";
import { BaseLayout } from "@/layouts/base/DefaultLayout/DefaultLayout";
import { VuseEnDefaultLayout } from "@/layouts/brands/vuse-en/DefaultLayout/DefaultLayout";

export const Layout = (() => {
  const { brand, locale } = getStore();

  switch (`${brand}-${locale}`) {
    case "vuse-en":
      return VuseEnDefaultLayout;
    default:
      return BaseLayout;
  }
})();
