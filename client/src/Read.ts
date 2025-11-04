import { readToken } from './data';

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
  const req = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch('/api/recipes', req);
  if (!res.ok) throw new Error(`Fetch error ${res.status} occurred.`);
  return (await res.json()) as Recipe[];
}

export async function readARecipe(idMeal: string): Promise<Recipe> {
  const req = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(`/api/recipes/${idMeal}`, req);
  if (!res.ok) throw new Error(`Fetch error ${res.status} occurred.`);
  return (await res.json()) as Recipe;
}

export async function readARecipeByName(strMeal: string): Promise<Recipe> {
  const req = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(`/api/recipes/${strMeal}`, req);
  if (!res.ok) throw new Error(`Fetch error ${res.status} occurred.`);
  return (await res.json()) as Recipe;
}
