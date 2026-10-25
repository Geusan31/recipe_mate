import RecipeCard from "./RecipeCard";

export default function RecipeGrid({ recipes, onRemove }) {
  return (
    <div className="mt-8 grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.slug} recipe={recipe} onRemove={onRemove} />
      ))}
    </div>
  );
}
