import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "../lib/storage";
import { AppContext } from "./context";
import { recipes as staticRecipes } from "../data/recipes";
import {
  fetchRecipes,
  createRecipe as apiCreateRecipe,
  updateRecipe as apiUpdateRecipe,
  deleteRecipe as apiDeleteRecipe,
} from "../services/recipeApi";

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => readStorage("recipemate.user", null));
  const [favorites, setFavorites] = useState(() =>
    readStorage("recipemate.favorites", []),
  );
  const [toastMessage, setToastMessage] = useState(null);

  // Live recipes state synced with NestJS backend
  const [recipes, setRecipes] = useState(staticRecipes);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [apiError, setApiError] = useState(null);

  const loadRecipesFromApi = useCallback(async () => {
    try {
      setLoadingRecipes(true);
      const data = await fetchRecipes();
      if (Array.isArray(data) && data.length > 0) {
        setRecipes(data);
        setApiError(null);
      }
    } catch (err) {
      console.warn("Backend not reachable yet, fallback to static recipes:", err);
      setApiError(err.message);
    } finally {
      setLoadingRecipes(false);
    }
  }, []);

  useEffect(() => {
    loadRecipesFromApi();
  }, [loadRecipesFromApi]);

  useEffect(() => {
    writeStorage("recipemate.user", user);
  }, [user]);

  useEffect(() => {
    writeStorage("recipemate.favorites", favorites);
  }, [favorites]);

  const login = useCallback((data) => setUser(data), []);
  const logout = useCallback(() => setUser(null), []);
  const clearToast = useCallback(() => setToastMessage(null), []);

  const toggleFavorite = useCallback((slug) => {
    setFavorites((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  }, []);

  const toast = useCallback((text) => {
    setToastMessage({ text });
  }, []);

  // CRUD actions connected directly to NestJS backend
  const addRecipe = useCallback(
    async (recipeData) => {
      const created = await apiCreateRecipe(recipeData);
      setRecipes((prev) => [created, ...prev]);
      toast(`Resep "${created.title}" berhasil ditambahkan!`);
      return created;
    },
    [toast],
  );

  const editRecipe = useCallback(
    async (idOrSlug, recipeData) => {
      const updated = await apiUpdateRecipe(idOrSlug, recipeData);
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === idOrSlug || r.slug === idOrSlug ? updated : r,
        ),
      );
      toast(`Resep "${updated.title}" berhasil diperbarui!`);
      return updated;
    },
    [toast],
  );

  const deleteRecipe = useCallback(
    async (idOrSlug) => {
      const result = await apiDeleteRecipe(idOrSlug);
      setRecipes((prev) =>
        prev.filter((r) => r.id !== idOrSlug && r.slug !== idOrSlug),
      );
      toast(result.message || "Resep berhasil dihapus!");
      return result;
    },
    [toast],
  );

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        favorites,
        toggleFavorite,
        toastMessage,
        toast,
        clearToast,
        recipes,
        loadingRecipes,
        apiError,
        reloadRecipes: loadRecipesFromApi,
        addRecipe,
        editRecipe,
        deleteRecipe,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
