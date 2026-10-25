import { useState } from "react";
import RecipeGrid from "../components/recipe/RecipeGrid";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import { useApp } from "../context/useApp";
import { ingredients } from "../data/ingredients";
import { rankRecipesByIngredients } from "../lib/recipe";

export default function CookPage() {
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const { toast } = useApp();

  function toggleIngredient(name) {
    setSelected((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );
    setResults([]);
    setSearched(false);
  }

  function search() {
    if (!selected.length) {
      toast("Pilih dulu minimal satu bahan");
      return;
    }

    const matches = rankRecipesByIngredients(selected);
    setResults(matches);
    setSearched(true);
    toast(`${matches.length} resep ditemukan`);
  }

  return (
    <>
      <PageHeader
        boxed
        center
        title="Masak Dengan Bahan"
        description="Bingung ingin masak apa? Pilih bahan-bahan yang kamu miliki di dapur, dan kami akan merekomendasikan resep yang tepat."
      />

      <section className="mb-16 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-2 text-[1.75rem] font-bold">Bahan Apa yang Kamu Punya Hari Ini?</h2>
        <p className="mb-8 text-gray-600">
          Pilih satu atau beberapa bahan, lalu tekan tombol cari resep.
        </p>

        <ul className="mb-8 flex flex-wrap gap-4">
          {ingredients.map((ingredient) => {
            const active = selected.includes(ingredient);
            return (
              <li key={ingredient}>
                <button
                  type="button"
                  onClick={() => toggleIngredient(ingredient)}
                  className={`inline-block rounded-full border px-5 py-2 font-medium shadow-sm ${
                    active
                      ? "border-amber-600 bg-amber-100 text-amber-700"
                      : "border-gray-200 bg-white hover:border-amber-600 hover:text-amber-600"
                  }`}
                >
                  {ingredient}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={search}>Cari Resep</Button>
          {selected.length > 0 && (
            <p className="text-gray-600">
              Bahan terpilih: <span className="font-semibold">{selected.join(", ")}</span>
            </p>
          )}
        </div>
      </section>

      <section className="mb-16">
        {searched && (
          <>
            <h2 className="mb-3 text-4xl font-extrabold leading-[1.2] text-gray-800">
              Resep yang Bisa Kamu Coba
            </h2>
            <p className="mb-2 text-lg text-gray-600">
              Ditemukan {results.length} resep berdasarkan bahan yang kamu pilih.
            </p>
            {results.length ? (
              <RecipeGrid recipes={results.map((item) => item.recipe)} />
            ) : (
              <EmptyState
                title="Belum ada resep yang cocok"
                description="Coba pilih bahan lain atau jelajahi semua resep yang tersedia."
                actionLabel="Lihat Semua Resep"
                actionTo="/resep"
              />
            )}
          </>
        )}
      </section>
    </>
  );
}
