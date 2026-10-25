import { useState } from "react";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import { articles } from "../data/blog";

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const filtered = articles.filter((article) => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return true;
    return (
      article.title.toLowerCase().includes(keyword) ||
      article.category.toLowerCase().includes(keyword) ||
      article.description.toLowerCase().includes(keyword)
    );
  });

  return (
    <>
      <PageHeader
        title="Blog RecipeMate"
        description="Artikel, tips memasak, dan inspirasi menu sehari-hari untuk membantu kamu lebih percaya diri di dapur."
      />

      <section className="mb-16">
        <div className="mb-8 flex flex-col gap-3">
          <label htmlFor="blog-search">Cari Artikel</label>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari artikel atau tips..."
            className="w-full max-w-[420px] px-5 py-3"
          />
        </div>

        {filtered.length ? (
          <ul className="grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
            {filtered.map((article) => (
              <li
                key={article.title}
                className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  width="400"
                  height="260"
                  loading="lazy"
                  className="h-[220px] w-full border-b border-gray-200 object-cover"
                />
                <div className="flex flex-1 flex-col p-6">
                  <span className="mb-4 inline-block self-start rounded bg-amber-100 px-2 py-1 text-xs font-bold uppercase tracking-[0.05em] text-amber-700">
                    {article.category}
                  </span>
                  <h2 className="mb-3 text-xl font-bold leading-[1.3]">{article.title}</h2>
                  <p className="flex-1 text-[0.95rem] text-gray-600">{article.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Artikel tidak ditemukan"
            description="Coba gunakan kata kunci lain untuk menemukan artikel yang kamu cari."
          />
        )}

        <div className="mt-10">
          <Button to="/resep" variant="outline">
            Cari Inspirasi Resep
          </Button>
        </div>
      </section>
    </>
  );
}
