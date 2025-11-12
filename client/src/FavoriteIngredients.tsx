import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Ingredient } from './Create';
import { readToken } from './data';
import { Recipe } from './Read';
import { addIngredientsAndMeasurements } from './addIngredientsAndMeasurements';

export function FavoriteIngredients() {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Ingredient[]>();
  const [recipes, setRecipes] = useState<Recipe[]>();
  const [error, setError] = useState<unknown>();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFavorites() {
      try {
        const req = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${readToken()}`,
          },
        };
        const res = await fetch(`/api/faveIngredients`, req);
        if (!res.ok) throw new Error(`Fetch error ${res.status} occurred.`);
        const faves = (await res.json()) as Ingredient[];
        setFavorites(faves);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    loadFavorites();
  }, []);

  async function favoritesPool(ingredient: string) {
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
      setError(err);
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
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading) return <div>Loading...</div>;

  if (error)
    return (
      <>
        <div>
          Error Loading{' '}
          {error instanceof Error ? error.message : 'Unknown Error'}
        </div>
        <div>
          <button className="btn bt-primary" onClick={() => navigate('/')}>
            Return to Home
          </button>
        </div>
      </>
    );

  return (
    <div>
      {favorites?.map((ingredient) => (
        <div
          className="card col"
          onClick={() => favoritesPool(ingredient.strIngredient)}>
          <h3>{ingredient.strIngredient}</h3>
        </div>
      ))}
      <div className="spacer"></div>
      <div className="align-middle mt5">
        {recipes ? (
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
          <p></p>
        )}
      </div>
    </div>
  );
}
