import { type Recipe } from './Read';

export function addIngredientsAndMeasurements(recipe: Recipe): Recipe {
  recipe.ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}` as keyof Recipe;
    const measureKey = `strMeasure${i}` as keyof Recipe;
    const ingVal = recipe[ingredientKey];
    const measVal = recipe[measureKey];
    const ingredient = typeof ingVal === 'string' ? ingVal.trim() : '';
    const measurement = typeof measVal === 'string' ? measVal.trim() : '';
    if (ingredient) {
      const entry = measurement
        ? `${ingredient}, ${measurement}; `
        : `${ingredient}; `;
      recipe.ingredients.push(entry);
    }
  }
  return recipe;
}
