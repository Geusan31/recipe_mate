import { Link, useSearchParams } from "react-router-dom";
import RecipeFilters from "../components/recipe/RecipeFilters";
import RecipeGrid from "../components/recipe/RecipeGrid";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import SearchBar from "../components/ui/SearchBar";
import { categories } from "../data/categories";
import { recipes } from "../data/recipes";
import { recipeMatches } from "../lib/recipe";

const perPage = 6;

const sorters = {
  popular: (a, b) => b.popularity - a.popularity,
  newest: (a, b) => b.date.localeCompare(a.date),
  rating: (a, b) => b.rating - a.rating,
  "waktu-masak": (a, b) => a.time - b.time,
};

const filterParams = {
  category: "kategori",
  difficulty: "kesulitan",
  sort: "sort",
};

function matchesTime(time, filter) {
  if (!filter) return true;
  if (filter === "cepat") return time <= 30;
  if (filter === "under-15") return time < 15;
  if (filter === "15-30") return time >= 15 && time <= 30;
  if (filter === "30-60") return time > 30 && time <= 60;
  return time > 60;
}

export default function RecipesPage() {
  const [params, setParams] = useSearchParams();

  const filters = {
    q: params.get("q") ?? "",
    category: params.get("kategori") ?? "",
    time:
      params.get("waktu") ?? (params.get("filter") === "cepat" ? "cepat" : ""),
    difficulty: params.get("kesulitan") ?? "",
    sort: params.get("sort") ?? "popular",
  };

  const filtered = recipes
    .filter((recipe) => {
      if (filters.category && !recipe.categories.includes(filters.category))
        return false;
      if (
        filters.difficulty &&
        recipe.difficulty.toLowerCase() !== filters.difficulty
      )
        return false;
      if (!matchesTime(recipe.time, filters.time)) return false;
      if (filters.q && !recipeMatches(recipe, filters.q)) return false;
      return true;
    })
    .sort(sorters[filters.sort] ?? sorters.popular);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(
    Math.max(1, Number(params.get("page") ?? 1)),
    totalPages,
  );
  const visibleRecipes = filtered.slice((page - 1) * perPage, page * perPage);

  function update(key, value) {
    const next = new URLSearchParams(params);
    next.delete("page");
    next.delete("filter");

    if (key === "time") {
      if (value) next.set("waktu", value);
      else next.delete("waktu");
    } else {
      const param = filterParams[key];
      if (value) next.set(param, value);
      else next.delete(param);
      if (filters.time) next.set("waktu", filters.time);
    }

    setParams(next);
  }

  function reset() {
    setParams({});
  }

  function goToPage(nextPage) {
    const next = new URLSearchParams(params);
    next.set("page", String(nextPage));
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <PageHeader
        boxed
        center
        title="Jelajahi Resep"
        description="Temukan berbagai resep lezat untuk setiap suasana dan kesempatan."
      >
        <SearchBar
          key={filters.q}
          to="/resep"
          initialValue={filters.q}
          inputId="resep-search-input"
          placeholder="Cari resep..."
          label="Cari resep"
          suggestions
        />
      </PageHeader>

      <section className="mb-16">
        <h2 className="mb-3 text-2xl font-bold">Filter Resep</h2>
        <RecipeFilters filters={filters} onChange={update} onReset={reset} />

        <div className="mb-6">
          <h2 className="mb-3 text-4xl font-extrabold leading-[1.2] text-gray-800">
            Semua Resep
          </h2>
          <p className="text-lg text-gray-600">
            {filtered.length
              ? `Menampilkan ${filtered.length} resep`
              : "Tidak ada resep yang cocok dengan filter tersebut"}
          </p>
        </div>

        {visibleRecipes.length ? (
          <RecipeGrid recipes={visibleRecipes} />
        ) : (
          <EmptyState
            title="Resep tidak ditemukan"
            description="Coba ubah kata kunci atau reset filter untuk melihat semua resep."
            actionLabel="Reset Filter"
            actionTo="/resep"
          />
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Navigasi halaman resep"
            className="mt-12 flex justify-center"
          >
            <ul className="flex gap-2">
              <li>
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="inline-flex h-10 min-w-10 items-center justify-center rounded border border-gray-200 bg-white px-3 font-medium text-gray-800 hover:border-amber-600 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sebelumnya
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (number) => (
                  <li key={number}>
                    <button
                      type="button"
                      onClick={() => goToPage(number)}
                      aria-current={number === page ? "page" : undefined}
                      className={`inline-flex h-10 min-w-10 items-center justify-center rounded border px-3 font-medium ${
                        number === page
                          ? "border-amber-600 bg-amber-600 text-white"
                          : "border-gray-200 bg-white text-gray-800 hover:border-amber-600 hover:text-amber-600"
                      }`}
                    >
                      {number}
                    </button>
                  </li>
                ),
              )}
              <li>
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="inline-flex h-10 min-w-10 items-center justify-center rounded border border-gray-200 bg-white px-3 font-medium text-gray-800 hover:border-amber-600 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Berikutnya
                </button>
              </li>
            </ul>
          </nav>
        )}
      </section>

      <section className="mb-16">
        <h2 className="mb-5 text-2xl font-bold">Jelajahi Kategori</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                to={`/kategori/${category.slug}`}
                className="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-8 text-lg font-bold text-gray-800 hover:border-amber-600 hover:text-amber-600"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
