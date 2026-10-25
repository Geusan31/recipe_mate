import { categories } from "../data/categories";
import { recipes } from "../data/recipes";

export function getRecipe(slug) {
  return recipes.find((recipe) => recipe.slug === slug) ?? null;
}

export function getCategory(slug) {
  return categories.find((category) => category.slug === slug) ?? null;
}

export function getCategoryRecipes(slug) {
  return recipes.filter((recipe) => recipe.categories.includes(slug));
}

export function formatTime(minutes) {
  if (minutes < 60) {
    return `${minutes} menit`;
  }
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1).replace(".", ",")} jam`;
}

export function formatNumber(value) {
  const fractions = [
    [0.25, "1/4"],
    [0.5, "1/2"],
    [0.75, "3/4"],
  ];

  if (Math.abs(value - Math.round(value)) < 0.05) {
    return String(Math.round(value));
  }

  for (const [fraction, label] of fractions) {
    if (Math.abs(value - Math.floor(value) - fraction) < 0.06) {
      return `${Math.floor(value) ? `${Math.floor(value)} ` : ""}${label}`;
    }
  }

  return value.toFixed(1).replace(".", ",");
}

export function scaleAmount(text, factor) {
  return text.replace(/\d+(?:\/\d+)?(?:[.,]\d+)?/, (match) => {
    const value = match.includes("/")
      ? match
          .split("/")
          .map(Number)
          .reduce((a, b) => a / b)
      : Number(match.replace(",", "."));

    return formatNumber(value * factor);
  });
}

export function recipeMatches(recipe, keyword) {
  const query = keyword.trim().toLowerCase();
  if (!query) {
    return true;
  }

  const ingredientText = recipe.ingredients
    .flatMap((group) => group.items)
    .join(" ");
  const text = [
    recipe.title,
    recipe.description,
    recipe.category,
    recipe.tips,
    ...recipe.tags,
    ingredientText,
  ]
    .join(" ")
    .toLowerCase();

  return text.includes(query);
}

export function searchRecipes(keyword) {
  return recipes.filter((recipe) => recipeMatches(recipe, keyword));
}

export function recipesWithIngredients(selected) {
  if (!selected.length) {
    return [];
  }

  return recipes.filter((recipe) =>
    selected.every((ingredient) => matchesIngredient(recipe, ingredient)),
  );
}

export function rankRecipesByIngredients(selected) {
  return recipes
    .map((recipe) => ({
      recipe,
      score: selected.filter((ingredient) =>
        matchesIngredient(recipe, ingredient),
      ).length,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

function matchesIngredient(recipe, ingredient) {
  const query = ingredient.trim().toLowerCase();
  const ingredientText = recipe.ingredients
    .flatMap((group) => group.items)
    .join(" ")
    .toLowerCase();

  return (
    recipe.tags.some((tag) => tag.includes(query) || query.includes(tag)) ||
    ingredientText.includes(query)
  );
}
