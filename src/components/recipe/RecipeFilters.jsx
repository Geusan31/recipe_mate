import { categories } from "../../data/categories";
import Button from "../ui/Button";

const fields = [
  { key: "category", label: "Kategori", emptyLabel: "Semua" },
  { key: "time", label: "Waktu Memasak" },
  {
    key: "difficulty",
    label: "Tingkat Kesulitan",
    emptyLabel: "Semua Tingkat",
  },
];

const timeOptions = [
  { value: "", label: "Kapan Saja" },
  { value: "cepat", label: "Maksimal 30 Menit" },
  { value: "under-15", label: "Di Bawah 15 Menit" },
  { value: "15-30", label: "15–30 Menit" },
  { value: "30-60", label: "30–60 Menit" },
  { value: "over-60", label: "Di Atas 60 Menit" },
];

export default function RecipeFilters({ filters, onChange, onReset }) {
  return (
    <div className="mb-8 flex flex-wrap gap-6 rounded-lg border border-gray-200 bg-white p-6">
      {fields.map((field) => (
        <div
          key={field.key}
          className="flex min-w-[150px] flex-1 flex-col gap-2"
        >
          <label htmlFor={`filter-${field.key}`}>{field.label}</label>
          <select
            id={`filter-${field.key}`}
            value={filters[field.key]}
            onChange={(event) => onChange(field.key, event.target.value)}
          >
            {field.key === "category" && (
              <>
                <option value="">{field.emptyLabel}</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </>
            )}
            {field.key === "time" &&
              timeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            {field.key === "difficulty" && (
              <>
                <option value="">{field.emptyLabel}</option>
                <option value="mudah">Mudah</option>
                <option value="sedang">Sedang</option>
                <option value="sulit">Sulit</option>
              </>
            )}
          </select>
        </div>
      ))}

      <div className="flex min-w-[150px] flex-1 flex-col gap-2">
        <label htmlFor="filter-sort">Urutkan</label>
        <select
          id="filter-sort"
          value={filters.sort}
          onChange={(event) => onChange("sort", event.target.value)}
        >
          <option value="popular">Populer</option>
          <option value="newest">Terbaru</option>
          <option value="rating">Rating Tertinggi</option>
          <option value="waktu-masak">Waktu Memasak</option>
        </select>
      </div>

      <div className="flex items-end">
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
