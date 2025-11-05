import { type Recipe } from './Read';
import { addIngredientsAndMeasurements } from './addIngredientsAndMeasurements';
import { readToken } from './data';

export async function AutoFillRecipe() {
  try {
    const randomReq = await fetch(
      'https://www.themealdb.com/api/json/v1/1/random.php',
      { method: 'GET' }
    );
    if (!randomReq.ok)
      throw new Error(`Ingredient fetch error ${randomReq.status}`);
    const randomRes = await randomReq.json();
    const randomMeal: Recipe = randomRes.meals[0];
    addIngredientsAndMeasurements(randomMeal);
    const randomMealPost = {
      method: 'POST',
      body: JSON.stringify(randomMeal),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${readToken()}`,
      },
    };
    const response = await fetch(`/api/recipes`, randomMealPost);
    if (!response.ok)
      throw new Error(`Database call to save recipe did not succeed.`);
    const result = (await response.json()) as Recipe;
    return result;
  } catch (err) {
    console.error(err);
  }
}
