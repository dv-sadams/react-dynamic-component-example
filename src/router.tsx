import { BrowserRouter, Route, Routes } from "react-router";
import App from "./routes/App";
import { Layout } from "./layouts/resolved/DefaultLayout";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
