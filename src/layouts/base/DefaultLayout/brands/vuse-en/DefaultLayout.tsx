import { Outlet } from "react-router";
import { defaultLayout } from "./DefaultLayout.css";

export const VuseEnDefaultLayout = () => {
  return (
    <div className={defaultLayout}>
      <Outlet />
    </div>
  );
};
