import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { useApp } from "../context/useApp";
import {
  formatNumber,
  formatTime,
  getRecipe,
  scaleAmount,
} from "../lib/recipe";
import { readStorage, writeStorage } from "../lib/storage";

export default function RecipeDetailPage() {
  const { slug } = useParams();
  const recipe = getRecipe(slug);

  if (!recipe) {
    return (
      <div>
        <h1 className="sr-only">Resep tidak ditemukan</h1>
        <EmptyState
          title="Resep tidak ditemukan"
          description="Resep yang kamu cari mungkin sudah dipindahkan atau tidak tersedia."
          actionLabel="Lihat Semua Resep"
          actionTo="/resep"
        />
      </div>
    );
  }

  return <RecipeDetail key={recipe.slug} recipe={recipe} />;
}

function RecipeDetail({ recipe }) {
  const { favorites, toggleFavorite, toast } = useApp();
  const [factor, setFactor] = useState(1);
  const [checked, setChecked] = useState(() =>
    readStorage(`recipemate.check.${recipe.slug}`, {}),
  );
  const saved = favorites.includes(recipe.slug);

  useEffect(() => {
    writeStorage(`recipemate.check.${recipe.slug}`, checked);
  }, [checked, recipe.slug]);

  function toggleChecked(key) {
    setChecked((current) => ({ ...current, [key]: !current[key] }));
  }

  function handleFavorite() {
    toggleFavorite(recipe.slug);
    toast(
      saved ? "Resep dihapus dari favorit" : "Resep ditambahkan ke favorit",
    );
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href);
    toast("Tautan resep disalin");
  }

  return (
    <article>
      <nav className="mb-6 text-sm text-gray-600">
        <Link className="text-amber-600" to="/">
          Beranda
        </Link>{" "}
        ›{" "}
        <Link className="text-amber-600" to="/resep">
          Resep
        </Link>{" "}
        › <span>{recipe.title}</span>
      </nav>

      <header className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="flex-1 lg:pr-8">
          <h1 className="mb-3 text-4xl font-extrabold leading-[1.2] text-gray-800">
            {recipe.title}
          </h1>
          <p className="max-w-[700px] text-lg text-gray-600">
            {recipe.description}
          </p>

          <dl className="mb-6 mt-6 grid gap-4 rounded-lg border border-gray-200 bg-white p-6 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-semibold text-gray-600">
                Waktu Memasak
              </dt>
              <dd className="text-lg font-bold text-gray-800">
                {formatTime(recipe.time)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-gray-600">Porsi</dt>
              <dd className="text-lg font-bold text-gray-800">
                {formatNumber(recipe.servings * factor)} Porsi
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-gray-600">
                Tingkat Kesulitan
              </dt>
              <dd className="text-lg font-bold text-gray-800">
                {recipe.difficulty}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-end gap-4 print:hidden">
            <div className="flex flex-col gap-2">
              <label htmlFor="porsi-faktor">Sesuaikan Porsi</label>
              <select
                id="porsi-faktor"
                value={factor}
                onChange={(event) => setFactor(Number(event.target.value))}
              >
                <option value={0.5}>1/2×</option>
                <option value={1}>1×</option>
                <option value={1.5}>1,5×</option>
                <option value={2}>2×</option>
                <option value={3}>3×</option>
              </select>
            </div>
            <Button
              variant={saved ? "primary" : "outline"}
              onClick={handleFavorite}
            >
              {saved ? "♥ Tersimpan di Favorit" : "♡ Simpan ke Favorit"}
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              Cetak Resep
            </Button>
            <Button variant="outline" onClick={copyLink}>
              Salin Tautan
            </Button>
          </div>
        </div>

        <img
          src={recipe.image}
          alt={recipe.title}
          width="600"
          height="520"
          className="h-[320px] w-full rounded-lg border border-gray-200 object-cover lg:w-[420px]"
        />
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
        <section>
          <h2 className="mb-5 border-b-2 border-gray-200 pb-2 text-2xl font-bold">
            Bahan-bahan
          </h2>
          {recipe.ingredients.map((group, groupIndex) => (
            <div key={group.group} className="mb-8">
              <h3 className="mb-3 text-lg font-bold text-amber-600">
                {group.group}
              </h3>
              <ul className="flex flex-col gap-2">
                {group.items.map((item, index) => {
                  const key = `b-${groupIndex}-${index}`;
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        aria-pressed={Boolean(checked[key])}
                        onClick={() => toggleChecked(key)}
                        className="flex w-full items-start gap-3 text-left"
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold ${
                            checked[key]
                              ? "border-amber-600 bg-amber-600 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {checked[key] ? "✓" : ""}
                        </span>
                        <span
                          className={
                            checked[key] ? "line-through opacity-60" : ""
                          }
                        >
                          {scaleAmount(item, factor)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-5 border-b-2 border-gray-200 pb-2 text-2xl font-bold">
            Cara Memasak
          </h2>
          <ol className="flex flex-col gap-4">
            {recipe.steps.map((step, index) => {
              const key = `s-${index}`;
              return (
                <li key={key}>
                  <button
                    type="button"
                    aria-pressed={Boolean(checked[key])}
                    onClick={() => toggleChecked(key)}
                    className={`flex w-full gap-3 text-left ${
                      checked[key] ? "line-through opacity-50" : ""
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      {recipe.tips && (
        <section className="mt-12 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-2xl font-bold">Tips</h2>
          <p className="text-gray-600">{recipe.tips}</p>
        </section>
      )}

      <div className="mt-12 print:hidden">
        <Button to="/resep" variant="outline">
          ← Kembali ke Semua Resep
        </Button>
      </div>
    </article>
  );
}
