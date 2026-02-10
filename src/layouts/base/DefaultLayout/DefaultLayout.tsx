import { Outlet } from "react-router";
import { defaultLayout } from "./DefaultLayout.css";

export const BaseLayout = () => {
  return (
    <div className={defaultLayout}>
      <Outlet />
    </div>
  );
};
