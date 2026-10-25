import { Link } from "react-router-dom";
import RecipeGrid from "../components/recipe/RecipeGrid";
import SearchBar from "../components/ui/SearchBar";
import { categories } from "../data/categories";
import { ingredients } from "../data/ingredients";
import { recipes } from "../data/recipes";

function RecipeSection({ title, description, to, linkLabel, items }) {
  return (
    <section className="mb-16">
      <h2 className="mb-3 text-4xl font-extrabold leading-[1.2] text-gray-800">
        {title}
      </h2>
      {description && (
        <p className="max-w-[700px] text-lg text-gray-600">{description}</p>
      )}
      <Link to={to} className="mt-4 inline-block font-semibold text-amber-600">
        {linkLabel} →
      </Link>
      <RecipeGrid recipes={items} />
    </section>
  );
}

export default function HomePage() {
  const popular = [...recipes]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);
  const quick = [...recipes].sort((a, b) => a.time - b.time).slice(0, 4);
  const tags = ["Nasi Goreng", "Ayam Bakar", "Rendang", "Pasta"];

  return (
    <>
      <section className="mb-16 rounded-lg border border-gray-200 bg-white px-4 py-20 text-center">
        <h1 className="mb-3 text-4xl font-extrabold leading-[1.2] text-gray-800">
          Masak Apa Hari Ini?
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-gray-600">
          RecipeMate membantu kamu menemukan resep lezat berdasarkan bahan yang
          sudah ada di dapur. Tidak perlu bingung lagi — cukup ketik bahan yang
          kamu punya, dan kami siapkan resepnya!
        </p>
        <SearchBar suggestions />
        <div className="mt-4 text-sm text-gray-600">
          <span>Populer:</span>
          {tags.map((tag) => (
            <Link
              key={tag}
              to={`/cari?q=${encodeURIComponent(tag)}`}
              className="ml-2 font-medium underline"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-2 text-[1.75rem] font-bold">Punya Bahan Apa?</h2>
        <p className="mb-8 text-gray-600">
          Pilih bahan yang kamu punya dan temukan resep yang bisa dibuat
          sekarang.
        </p>
        <ul className="flex flex-wrap justify-center gap-4">
          {ingredients.slice(0, 6).map((ingredient) => (
            <li key={ingredient}>
              <Link
                to={`/cari?ingredients=${encodeURIComponent(ingredient.toLowerCase())}`}
                className="inline-block rounded-full border border-gray-200 bg-white px-5 py-2 font-medium shadow-sm hover:border-amber-600 hover:text-amber-600"
              >
                {ingredient}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/masak-dengan-bahan"
          className="mt-4 inline-block font-semibold text-amber-600"
        >
          Lihat semua bahan →
        </Link>
      </section>

      <RecipeSection
        title="Resep Populer"
        to="/resep?sort=popular"
        linkLabel="Lihat semua"
        items={popular}
      />

      <RecipeSection
        title="Masak Cepat"
        description="Siap dalam 30 menit atau kurang."
        to="/resep?filter=cepat"
        linkLabel="Lihat semua"
        items={quick}
      />

      <section className="mb-16">
        <h2 className="mb-3 text-4xl font-extrabold leading-[1.2] text-gray-800">
          Kategori
        </h2>
        <p className="max-w-[700px] text-lg text-gray-600">
          Temukan resep berdasarkan kategori favoritmu.
        </p>
        <ul className="mt-8 grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
          {categories.slice(0, 6).map((category) => (
            <li key={category.slug}>
              <Link
                to={`/kategori/${category.slug}`}
                className="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-12 text-xl font-bold text-gray-800 hover:border-amber-600 hover:text-amber-600"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/kategori"
          className="mt-4 inline-block font-semibold text-amber-600"
        >
          Lihat semua kategori →
        </Link>
      </section>
    </>
  );
}
