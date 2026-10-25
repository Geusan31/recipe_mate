import RecipeGrid from "../components/recipe/RecipeGrid";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import { useApp } from "../context/useApp";
import { getRecipe } from "../lib/recipe";

export default function FavoritesPage() {
  const { favorites, toggleFavorite, toast } = useApp();
  const favoriteRecipes = favorites.map((slug) => getRecipe(slug)).filter(Boolean);

  function removeFavorite(slug) {
    toggleFavorite(slug);
    toast("Resep dihapus dari favorit");
  }

  return (
    <>
      <PageHeader
        boxed
        center
        title="Resep Favorit"
        description="Akses kembali semua resep masakan pilihan yang telah kamu simpan sebelumnya."
      />

      <section className="mb-16">
        {favoriteRecipes.length ? (
          <>
            <p className="mb-2 text-gray-600">
              Kamu memiliki {favoriteRecipes.length} resep favorit.
            </p>
            <RecipeGrid recipes={favoriteRecipes} onRemove={removeFavorite} />
          </>
        ) : (
          <EmptyState
            title="Belum ada resep favorit"
            description="Simpan resep yang kamu suka agar mudah ditemukan kembali nanti."
            actionLabel="Jelajahi Resep"
            actionTo="/resep"
          />
        )}
      </section>
    </>
  );
}
