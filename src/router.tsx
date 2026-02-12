import { BrowserRouter, Route, Routes } from "react-router";
import App from "./routes/App";
import { DefaultLayout } from "./layouts";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
