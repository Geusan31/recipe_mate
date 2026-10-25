import { Route, Routes } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import HomePage from "../pages/HomePage";

export default function AppRouter() {
  return (
    <Routes element={<Layout />}>
      <Route element={<HomePage />} />
    </Routes>
  );
}
