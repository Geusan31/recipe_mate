import { Link } from "react-router-dom";
import { formatTime } from "../../lib/recipe";
import Button from "../ui/Button";

export default function RecipeCard({ recipe, onRemove }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <Link to={`/resep/${recipe.slug}`}>
        <img
          src={recipe.image}
          alt={recipe.title}
          width="400"
          height="260"
          loading="lazy"
          className="h-[220px] w-full border-b border-gray-200 object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-4 inline-block self-start rounded bg-amber-100 px-2 py-1 text-xs font-bold uppercase tracking-[0.05em] text-amber-700">
          {recipe.category}
        </span>
        <h3 className="mb-3 text-xl font-bold leading-[1.3]">
          <Link to={`/resep/${recipe.slug}`}>{recipe.title}</Link>
        </h3>
        <p className="mb-6 flex-1 text-[0.95rem] text-gray-600">
          {recipe.description}
        </p>
        <dl className="mb-6 grid grid-cols-3 gap-2 border-t border-gray-200 pt-4 text-xs text-gray-600 sm:text-sm">
          <div>
            <dt className="font-semibold text-gray-800">Waktu</dt>
            <dd>{formatTime(recipe.time)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-800">Kesulitan</dt>
            <dd>{recipe.difficulty}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-800">Rating</dt>
            <dd>{recipe.rating} / 5</dd>
          </div>
        </dl>
        <Button to={`/resep/${recipe.slug}`} variant="light">
          Lihat Resep
        </Button>
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(recipe.slug)}
            className="mt-3 w-full rounded border border-gray-200 bg-bg-body p-3 text-center font-semibold text-gray-800 hover:border-amber-600"
          >
            Hapus dari Favorit
          </button>
        )}
      </div>
    </article>
  );
}
