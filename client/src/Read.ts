export type Recipe = {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string | undefined;
  ingredients: string[] | null;
  measurements: string[] | null;
  strYoutube: string | null;
  userId: number;
  sharedBy: number | null;
  seenShared: boolean | null;
};

export async function readRecipes(): Promise<Recipe[]> {
  const res = await fetch('/api/recipes', { method: 'GET' });
  if (!res.ok) throw new Error(`Fetch error ${res.status} occurred.`);
  return (await res.json()) as Recipe[];
}

export async function readARecipe(idMeal: string): Promise<Recipe> {
  const res = await fetch(`/api/recipes/${idMeal}`, { method: 'GET' });
  if (!res.ok) throw new Error(`Fetch error ${res.status} occurred.`);
  return (await res.json()) as Recipe;
}
