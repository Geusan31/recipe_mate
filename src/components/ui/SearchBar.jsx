import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recipes } from "../../data/recipes";
import Button from "./Button";

export default function SearchBar({
  to = "/cari",
  initialValue = "",
  placeholder = "Cari resep atau masukkan bahan",
  label = "Cari resep atau bahan masakan",
  inputId = "search-input",
  suggestions = false,
}) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const query = value.trim();
    navigate(query ? `${to}?q=${encodeURIComponent(query)}` : to);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mx-auto mt-8 flex w-full max-w-[600px] flex-col gap-3 md:flex-row"
    >
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        list={suggestions ? `${inputId}-suggestions` : undefined}
        className="flex-1 px-5 py-3.5 text-lg"
      />
      {suggestions && (
        <datalist id={`${inputId}-suggestions`}>
          {recipes.map((recipe) => (
            <option key={recipe.slug} value={recipe.title} />
          ))}
        </datalist>
      )}
      <Button type="submit" className="px-8 py-3.5 text-lg">
        Cari
      </Button>
    </form>
  );
}
