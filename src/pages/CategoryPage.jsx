import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import RecipeGrid from "../components/recipe/RecipeGrid";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import { getCategory, getCategoryRecipes } from "../lib/recipe";

const sorters = {
  default: () => 0,
  popular: (a, b) => b.popularity - a.popularity,
  rating: (a, b) => b.rating - a.rating,
  time: (a, b) => a.time - b.time,
  title: (a, b) => a.title.localeCompare(b.title),
};

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategory(slug);

  if (!category) {
    return (
      <div>
        <h1 className="sr-only">Kategori tidak ditemukan</h1>
        <EmptyState
          title="Kategori tidak ditemukan"
          description="Kategori yang kamu cari tidak tersedia."
          actionLabel="Lihat Semua Kategori"
          actionTo="/kategori"
        />
      </div>
    );
  }

  return <CategoryContent key={category.slug} category={category} />;
}

function CategoryContent({ category }) {
  const [sort, setSort] = useState("default");
  const [visible, setVisible] = useState(6);
  const items = getCategoryRecipes(category.slug);
  const sorted = [...items].sort(sorters[sort]);

  function changeSort(value) {
    setSort(value);
    setVisible(6);
  }

  return (
    <>
      <PageHeader title={`Resep ${category.name}`} description={category.description}>
        <Link to="/kategori" className="mt-6 inline-block font-semibold text-amber-600">
          ← Kembali ke Daftar Kategori
        </Link>
      </PageHeader>

      <section className="mb-16">
        {sorted.length ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label htmlFor="category-sort">Urutkan</label>
                <select
                  id="category-sort"
                  value={sort}
                  onChange={(event) => changeSort(event.target.value)}
                >
                  <option value="default">Standar</option>
                  <option value="popular">Populer</option>
                  <option value="rating">Rating Tertinggi</option>
                  <option value="time">Waktu Memasak</option>
                  <option value="title">Nama Resep</option>
                </select>
              </div>
              <p className="text-gray-600">
                Menampilkan {Math.min(visible, sorted.length)} dari {sorted.length} resep
              </p>
            </div>

            <RecipeGrid recipes={sorted.slice(0, visible)} />

            {visible < sorted.length && (
              <div className="mt-8 text-center">
                <Button variant="outline" onClick={() => setVisible((current) => current + 6)}>
                  Muat Lebih Banyak
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="Belum ada resep"
            description="Kategori ini belum memiliki resep. Coba jelajahi kategori lain."
            actionLabel="Lihat Semua Resep"
            actionTo="/resep"
          />
        )}
      </section>
    </>
  );
}
