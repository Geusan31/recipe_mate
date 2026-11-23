import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/useApp";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

const categoriesList = [
  "Sarapan",
  "Makan Siang",
  "Makan Malam",
  "Camilan",
  "Minuman",
  "Makanan Penutup",
];

const difficultyOptions = ["Mudah", "Sedang", "Sulit"];

export default function ManageRecipesPage() {
  const {
    recipes,
    loadingRecipes,
    apiError,
    addRecipe,
    editRecipe,
    deleteRecipe,
    reloadRecipes,
  } = useApp();

  // Create form state
  const [formData, setFormData] = useState({
    title: "",
    category: "Makan Siang",
    description: "",
    time: 20,
    servings: 2,
    difficulty: "Mudah",
    rating: 4.8,
    image: "",
    ingredientsText: "2 piring nasi putih\n2 butir telur\n3 siung bawang putih",
    stepsText: "Tumis bumbu hingga harum.\nMasukkan telur dan nasi.\nAduk hingga matang.",
  });

  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit modal state
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editError, setEditError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "time" || name === "servings" || name === "rating" ? Number(value) : value,
    }));
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "time" || name === "servings" || name === "rating" ? Number(value) : value,
    }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const ingredients = [
        {
          group: "Bahan Utama",
          items: formData.ingredientsText
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      ];

      const steps = formData.stepsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      await addRecipe({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        time: Number(formData.time),
        servings: Number(formData.servings),
        difficulty: formData.difficulty,
        rating: Number(formData.rating),
        image: formData.image || "/images/recipes/nasi-goreng-spesial.jpg",
        ingredients,
        steps,
      });

      // Reset form on success
      setFormData({
        title: "",
        category: "Makan Siang",
        description: "",
        time: 20,
        servings: 2,
        difficulty: "Mudah",
        rating: 4.8,
        image: "",
        ingredientsText: "2 piring nasi putih\n2 butir telur\n3 siung bawang putih",
        stepsText: "Tumis bumbu hingga harum.\nMasukkan telur dan nasi.\nAduk hingga matang.",
      });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(recipe) {
    setEditingRecipe(recipe);
    setEditError(null);
    setEditFormData({
      title: recipe.title,
      category: recipe.category,
      description: recipe.description,
      time: recipe.time,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      rating: recipe.rating,
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setEditError(null);
    setIsEditing(true);

    try {
      await editRecipe(editingRecipe.id || editingRecipe.slug, {
        title: editFormData.title,
        category: editFormData.category,
        description: editFormData.description,
        time: Number(editFormData.time),
        servings: Number(editFormData.servings),
        difficulty: editFormData.difficulty,
        rating: Number(editFormData.rating),
      });
      setEditingRecipe(null);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setIsEditing(false);
    }
  }

  async function handleDelete(recipe) {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus resep "${recipe.title}" dari backend?`,
    );
    if (!confirmDelete) return;

    try {
      await deleteRecipe(recipe.id || recipe.slug);
    } catch (err) {
      alert(`Gagal menghapus resep: ${err.message}`);
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <PageHeader
        title="Kelola Resep (CRUD Backend NestJS)"
        description="Integrasi penuh operasi Create, Read, Update, Delete ke REST API NestJS."
      />

      {/* Backend Status Alert */}
      <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 flex items-center justify-between">
        <div>
          <span className="font-bold">Status Backend: </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            NestJS Active (http://localhost:3000/recipes)
          </span>
          <span className="ml-3 text-sm text-emerald-700">
            Total {recipes.length} resep tersinkronisasi.
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={reloadRecipes} disabled={loadingRecipes}>
          {loadingRecipes ? "Memuat..." : "Refresh Data"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Form Tambah Resep (POST) */}
        <div className="lg:col-span-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <span className="rounded bg-amber-500 px-2 py-0.5 text-xs font-bold text-white uppercase">
              POST
            </span>
            <h2 className="text-xl font-bold text-gray-900">Tambah Resep Baru</h2>
          </div>

          {formError && (
            <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
              <span className="font-semibold">Validasi NestJS Gagal:</span> {formError}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Judul Resep <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: Ayam Bakar Bumbu Madu"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Kategori <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                >
                  {categoriesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Tingkat Kesulitan <span className="text-rose-500">*</span>
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                >
                  {difficultyOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Waktu (Menit) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="time"
                  min="1"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Porsi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="servings"
                  min="1"
                  required
                  value={formData.servings}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  name="rating"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Deskripsi Singkat <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                rows="2"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Jelaskan cita rasa atau keunikan resep..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Bahan-bahan (1 baris per bahan)
              </label>
              <textarea
                name="ingredientsText"
                rows="3"
                value={formData.ingredientsText}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Langkah Pembuatan (1 baris per langkah)
              </label>
              <textarea
                name="stepsText"
                rows="3"
                value={formData.stepsText}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>

            <Button
              type="submit"
              className="w-full justify-center py-2.5 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim ke Backend..." : "Simpan Resep ke Backend"}
            </Button>
          </form>
        </div>

        {/* Daftar Resep (GET, PATCH, DELETE) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="rounded bg-sky-600 px-2 py-0.5 text-xs font-bold text-white uppercase">
                GET
              </span>
              <h2 className="text-xl font-bold text-gray-900">
                Daftar Resep Aktif ({recipes.length})
              </h2>
            </div>
          </div>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-2">
            {recipes.map((recipe) => (
              <div
                key={recipe.id || recipe.slug}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-amber-300 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      ID: {recipe.id || "-"}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      {recipe.category}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      ⭐ {recipe.rating || 0}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mt-1">
                    <Link
                      to={`/resep/${recipe.slug}`}
                      className="hover:text-amber-600 transition"
                    >
                      {recipe.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                    {recipe.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <span>⏱️ {recipe.time} menit</span>
                    <span>👥 {recipe.servings} porsi</span>
                    <span>📊 {recipe.difficulty}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => startEdit(recipe)}
                    className="rounded-lg border border-sky-300 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-100 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(recipe)}
                    className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Edit Resep (PATCH) */}
      {editingRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white uppercase">
                  PATCH
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  Edit Resep (ID: {editingRecipe.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingRecipe(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="my-3 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Judul Resep
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={editFormData.title || ""}
                  onChange={handleEditChange}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={editFormData.category || ""}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  >
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Tingkat Kesulitan
                  </label>
                  <select
                    name="difficulty"
                    value={editFormData.difficulty || "Mudah"}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  >
                    {difficultyOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Waktu (Menit)
                  </label>
                  <input
                    type="number"
                    name="time"
                    min="1"
                    value={editFormData.time || 20}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Porsi
                  </label>
                  <input
                    type="number"
                    name="servings"
                    min="1"
                    value={editFormData.servings || 2}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editFormData.rating || 5}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Deskripsi Singkat
                </label>
                <textarea
                  name="description"
                  rows="2"
                  value={editFormData.description || ""}
                  onChange={handleEditChange}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingRecipe(null)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isEditing}
                >
                  {isEditing ? "Memperbarui..." : "Simpan Perubahan (PATCH)"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
