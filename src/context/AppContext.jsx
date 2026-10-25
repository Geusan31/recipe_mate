import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "../lib/storage";
import { AppContext } from "./context";

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => readStorage("recipemate.user", null));
  const [favorites, setFavorites] = useState(() => readStorage("recipemate.favorites", []));
  const [toastMessage, setToastMessage] = useState(null);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
