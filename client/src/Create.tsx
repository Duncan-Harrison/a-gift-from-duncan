import { useState, useEffect } from 'react';
import { type Recipe } from './Read';
import { readToken } from './data';
import { addIngredientsAndMeasurements } from './addIngredientsAndMeasurements';
import { useNavigate } from 'react-router-dom';

export type Ingredient = {
  idIngredient: string;
  strIngredient: string;
  strDescription: string | null;
  strThumb: string | null;
};

export function SearchRecipe() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [idOfIngredient, setIdOfIngredient] = useState<Ingredient>();
  const navigate = useNavigate();

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
      const preppedRecipeReq = await fetch(initialRecipe);
      if (!preppedRecipeReq.ok) throw new Error(`Recipe could not be found.`);
      const preppedRecipeRes = await preppedRecipeReq.json();
      const preppedRecipe: Recipe = preppedRecipeRes.meals[0];
      addIngredientsAndMeasurements(preppedRecipe);
      const savedRecipeReq = {
        method: 'POST',
        body: JSON.stringify(preppedRecipe),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${readToken()}`,
        },
      };
      const response = await fetch(`/api/recipes`, savedRecipeReq);
      if (!response.ok) throw new Error(`Recipe will not save at this time.`);
      const result = (await response.json()) as Recipe;
      alert(result.strMeal + ' has been saved to Your Recipes!');
      setRecipes([...recipes, result]);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  }

  async function isolateFavorite(name: string) {
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
      for (let i = 0; i < meals.length; i++) {
        const trueIngredient: Ingredient = {
          idIngredient: meals[i].idIngredient,
          strIngredient: meals[i].strIngredient,
          strDescription: meals[i].strDescription,
          strThumb: meals[i].strThumb,
        };
        if (trueIngredient.strIngredient === name) {
          setIdOfIngredient(trueIngredient);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function saveIngredientForLater(food: Ingredient) {
    const ingredientInfo = food;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${readToken()}`,
      },
      body: JSON.stringify(ingredientInfo),
    };
    const res = await fetch(`/api/faveIngredients`, req);
    if (!res.ok) throw new Error(`Fetch error ${res.status}`);
    alert((await res.json()) as Ingredient);
  }

  function toSnakeCase(str: string): string {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[\s]+/g, '_')
      .toLowerCase();
  }

  function handleChange(event: any) {
    const item: string = event.target.value;
    const snakeFormat = toSnakeCase(item);
    displayRecipes(snakeFormat);
    isolateFavorite(item);
  }

  if (isLoading) return <div className="card-body">Loading...</div>;

  return (
    <div className="d-flex flex-column justify-content-end mt5">
      <div className="mt5">
        {idOfIngredient && <h3>{idOfIngredient.strIngredient}</h3>}
        <div className="row justify-content-around">
          <div className="col-10 col-sm-9 mt-2">
            <select
              name="Ingredient Select"
              onChange={handleChange}
              className="form-control">
              <option value="">--Please choose an ingredient--</option>
              {ingredients &&
                ingredients.map((ing: Ingredient) => (
                  <option
                    key={ing.idIngredient}
                    value={ing.strIngredient}
                    className="column-gap">
                    {ing.strIngredient}
                  </option>
                ))}
              ;
            </select>
          </div>
          <div className="col-sm-3 mt-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                idOfIngredient
                  ? saveIngredientForLater(idOfIngredient)
                  : alert(`No ingredient selected.`)
              }>
              Favorite
            </button>
          </div>
        </div>
      </div>
      <div className="spacer m-2"></div>
      <div className="align-middle mt5">
        {recipes?.length > 0 ? (
          recipes?.map((r: Recipe) => (
            <div className="card-body m-2" key={r.idMeal}>
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
                      className="btn btn-primary mt-2"
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
    </div>
  );
}
