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
        <Route path="cari" element={<SearchPage />} />
        <Route path="favorit" element={<FavoritesPage />} />
        <Route path="masak-dengan-bahan" element={<CookPage />} />
        <Route path="perencana-makan" element={<PlannerPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="tentang" element={<AboutPage />} />
        <Route path="kontak" element={<ContactPage />} />
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="register" element={<AuthPage mode="register" />} />
        <Route path="privasi" element={<LegalPage type="privacy" />} />
        <Route path="syarat" element={<LegalPage type="terms" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
