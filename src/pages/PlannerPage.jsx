import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { useApp } from "../context/useApp";
import { recipes } from "../data/recipes";
import { formatTime, getRecipe } from "../lib/recipe";
import { readStorage, writeStorage } from "../lib/storage";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const meals = ["Sarapan", "Makan Siang", "Makan Malam"];

export default function PlannerPage() {
  const [plan, setPlan] = useState(() => readStorage("recipemate.plan", {}));
  const [picker, setPicker] = useState(null);
  const [query, setQuery] = useState("");
  const { toast } = useApp();

  useEffect(() => {
    writeStorage("recipemate.plan", plan);
  }, [plan]);

  const pickerRecipes = recipes.filter((recipe) => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return true;
    return (
      recipe.title.toLowerCase().includes(keyword) ||
      recipe.category.toLowerCase().includes(keyword)
    );
  });

  function openPicker(day, meal) {
    setPicker({ day, meal });
    setQuery("");
  }

  function chooseRecipe(recipe) {
    setPlan((current) => ({
      ...current,
      [picker.day]: {
        ...(current[picker.day] ?? {}),
        [picker.meal]: recipe.slug,
      },
    }));
    toast(`${recipe.title} masuk ke ${picker.day} · ${picker.meal}`);
    setPicker(null);
  }

  function clearPlan() {
    setPlan({});
    toast("Jadwal mingguan dikosongkan");
  }

  return (
    <>
      <PageHeader
        boxed
        center
        title="Perencana Makan"
        description="Susun menu sarapan, makan siang, dan makan malam untuk seminggu penuh agar belanja dan memasak lebih teratur."
      />

      <section className="mb-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {days.map((day) => (
            <article key={day} className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-xl font-bold">{day}</h2>
              <ul className="flex flex-col gap-3">
                {meals.map((meal) => {
                  const slug = plan[day]?.[meal];
                  const recipe = slug ? getRecipe(slug) : null;

                  return (
                    <li
                      key={meal}
                      className="flex items-start justify-between gap-3 border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-sm font-semibold text-gray-600">{meal}</span>
                      <button
                        type="button"
                        onClick={() => openPicker(day, meal)}
                        className="text-right text-sm font-semibold text-amber-600 hover:underline"
                      >
                        {recipe ? recipe.title : "Pilih Resep"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4 print:hidden">
          <Button variant="outline" onClick={() => window.print()}>
            Cetak Jadwal
          </Button>
          <Button variant="outline" onClick={clearPlan}>
            Kosongkan Jadwal
          </Button>
        </div>
      </section>

      {picker && (
        <div
          className="fixed inset-0 z-[200] overflow-y-auto bg-gray-900/50 p-4 py-12"
          onClick={(event) => {
            if (event.target === event.currentTarget) setPicker(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="picker-title"
            className="mx-auto max-w-[560px] rounded-lg border border-gray-200 bg-white p-6"
          >
            <h2 id="picker-title" className="mb-5 text-2xl font-bold">
              Pilih Resep · {picker.day} · {picker.meal}
            </h2>
            <label htmlFor="picker-search" className="sr-only">
              Cari resep
            </label>
            <input
              id="picker-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari resep..."
              autoFocus
              className="w-full px-5 py-3"
            />
            <ul className="mt-6 flex max-h-[50vh] flex-col gap-3 overflow-y-auto">
              {pickerRecipes.map((recipe) => (
                <li key={recipe.slug}>
                  <button
                    type="button"
                    onClick={() => chooseRecipe(recipe)}
                    className="w-full rounded border border-gray-200 bg-white px-5 py-3 text-left font-semibold text-gray-800 hover:border-amber-600 hover:text-amber-600"
                  >
                    {recipe.title}
                    <span className="block text-sm font-normal text-gray-600">
                      {recipe.category} · {formatTime(recipe.time)}
                    </span>
                  </button>
                </li>
              ))}
              {!pickerRecipes.length && (
                <li className="py-4 text-center text-gray-600">Resep tidak ditemukan.</li>
              )}
            </ul>
            <Button variant="outline" className="mt-6" onClick={() => setPicker(null)}>
              Batal
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
