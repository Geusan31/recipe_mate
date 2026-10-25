import { useSearchParams } from "react-router-dom";
import RecipeGrid from "../components/recipe/RecipeGrid";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import SearchBar from "../components/ui/SearchBar";
import { recipes } from "../data/recipes";
import { recipesWithIngredients, searchRecipes } from "../lib/recipe";

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const ingredientParam = params.get("ingredients") ?? params.get("ingredient") ?? "";
  const selected = ingredientParam
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const results = selected.length
    ? recipesWithIngredients(selected)
    : query
      ? searchRecipes(query)
      : [...recipes].sort((a, b) => b.popularity - a.popularity);

  const heading = query
    ? `Hasil Pencarian untuk "${query}"`
    : selected.length
      ? `Resep dengan Bahan: ${selected.join(", ")}`
      : "Semua Resep";

  return (
    <>
      <PageHeader
        boxed
        center
        title="Cari Resep"
        description="Ketikkan nama resep atau bahan masakan untuk menemukan hidangan favoritmu."
      >
        <SearchBar
          key={query}
          initialValue={query}
          inputId="search-input"
          placeholder="Cari resep atau masukkan bahan"
          label="Cari resep atau bahan masakan"
          suggestions
        />
      </PageHeader>

      <section className="mb-16">
        <header>
          <h2 className="mb-3 text-4xl font-extrabold leading-[1.2] text-gray-800">{heading}</h2>
          <p className="text-lg text-gray-600">
            {results.length
              ? `Ditemukan ${results.length} resep yang sesuai dengan pencarianmu.`
              : "Tidak ada resep yang sesuai dengan pencarianmu."}
          </p>
        </header>

        {results.length ? (
          <RecipeGrid recipes={results} />
        ) : (
          <div className="mt-8">
            <EmptyState
              title="Resep tidak ditemukan"
              description="Coba gunakan kata kunci lain atau pilih bahan yang lebih umum."
              actionLabel="Jelajahi Semua Resep"
              actionTo="/resep"
            />
          </div>
        )}
      </section>
    </>
  );
}
