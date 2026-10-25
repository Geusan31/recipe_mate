import { useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import { categories } from "../data/categories";
import { recipes } from "../data/recipes";

export default function CategoriesPage() {
  const [query, setQuery] = useState("");
  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function countRecipes(slug) {
    return recipes.filter((recipe) => recipe.categories.includes(slug)).length;
  }

  return (
    <>
      <PageHeader
        title="Kategori Resep"
        description="Temukan resep berdasarkan jenis hidangan, suasana makan, atau gaya masakan yang kamu inginkan."
      />

      <section className="mb-16">
        <label htmlFor="category-search" className="sr-only">
          Cari kategori
        </label>
        <input
          id="category-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari kategori..."
          className="mb-8 w-full max-w-[420px] px-5 py-3"
        />

        {filtered.length ? (
          <ul className="grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
            {filtered.map((category) => (
              <li key={category.slug}>
                <Link
                  to={`/kategori/${category.slug}`}
                  className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-amber-600"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    width="400"
                    height="240"
                    loading="lazy"
                    className="h-[180px] w-full border-b border-gray-200 object-cover"
                  />
                  <div className="flex flex-1 flex-col p-6 text-center">
                    <h2 className="mb-2 text-xl font-bold text-gray-800">{category.name}</h2>
                    <p className="mb-4 flex-1 text-gray-600">{category.description}</p>
                    <span className="font-semibold text-amber-600">
                      {countRecipes(category.slug)} resep
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Kategori tidak ditemukan"
            description="Coba gunakan kata kunci lain untuk menemukan kategori yang kamu inginkan."
          />
        )}
      </section>
    </>
  );
}
