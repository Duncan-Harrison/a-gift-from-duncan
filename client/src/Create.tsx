import { useState, useEffect } from 'react';
import { type Recipe } from './Read';

export type Ingredient = {
  idIngredient: string;
  strIngredient: string;
  strDescription: string;
  strThumb: string | null;
};

export function SearchRecipe() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function getIngredients(): Promise<void> {
      try {
        const ingred = await fetch(
          'https://www.themealdb.com/api/json/v1/1/list.php?i=list',
          {
            method: 'GET',
          }
        );
        if (!ingred.ok)
          throw new Error(`Ingredient fetch error ${ingred.status}`);
        const iList = await ingred.json();
        const meals = iList.meals as Ingredient[];
        if (meals && meals.length) setIngredients(meals);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    getIngredients();
  }, []);

  async function displayRecipes(ingredient: string) {
    try {
      const request = new Request(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`,
        { method: 'GET' }
      );
      const response = await fetch(request);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const result = await response.json();
      const resultRecipes = result.meals as Recipe[];
      if (resultRecipes && resultRecipes.length) setRecipes(resultRecipes);
      console.log(resultRecipes);
    } catch (err) {
      console.error(err);
    }
  }

  async function saveRecipe(idMeal: string) {
    try {
      const initialRecipe = new Request(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`,
        { method: 'GET' }
      );
      const preppedRecipe = await fetch(initialRecipe);
      if (!preppedRecipe.ok) throw new Error(`Recipe could not be found.`);
      const savedRecipe = new Request(`/api/recipes`, {
        method: 'POST',
        body: JSON.stringify(preppedRecipe),
      });
      const response = await fetch(savedRecipe);
      if (!response.ok) throw new Error(`Recipe will not save at this time.`);
      const result = (await response.json()) as Recipe;
      alert(result);
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading) return <div className="card-body">Loading...</div>;

  function toSnakeCase(str: string): string {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[\s]+/g, '_')
      .toLowerCase();
  }

  function handleChange(event: any) {
    const snakeFormat = toSnakeCase(event.target.value);
    displayRecipes(snakeFormat);
  }

  return (
    <div>
      <div>
        <select name="Ingredient Select" onChange={handleChange}>
          {ingredients &&
            ingredients.map((ing: Ingredient) => (
              <option key={ing.idIngredient} value={ing.strIngredient}>
                {ing.strIngredient}
              </option>
            ))}
          ;
        </select>
      </div>
      {recipes?.length > 0 ? (
        recipes?.map((r: Recipe) => (
          <div className="card-body" key={r.idMeal}>
            <div className="col">
              <div className="row">
                <div className="col-4">
                  <img
                    src={r.strMealThumb}
                    className="img-fluid"
                    alt={r.strMeal}
                  />
                </div>
                <div className="col-8">
                  <h3>{r.strMeal}</h3>
                  <button
                    className="btn btn-primary"
                    onClick={() => saveRecipe(r.idMeal)}>
                    Save Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No recipes were found using this ingredient</p>
      )}
    </div>
  );
}
