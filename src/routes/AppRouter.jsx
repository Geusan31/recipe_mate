import { Route, Routes } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import HomePage from "../pages/HomePage";
import RecipesPage from "../pages/RecipesPage";
import RecipeDetailPage from "../pages/RecipeDetailPage";
import CategoriesPage from "../pages/CategoriesPage";
import CategoryPage from "../pages/CategoryPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="resep" element={<RecipesPage />} />
        <Route path="resep/:slug" element={<RecipeDetailPage />} />
        <Route path="kategori" element={<CategoriesPage />} />
        <Route path="kategori/:slug" element={<CategoryPage />} />
      </Route>
    </Routes>
  );
}
