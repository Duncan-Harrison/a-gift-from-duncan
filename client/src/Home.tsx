import { useEffect, useState } from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { type Recipe, readRecipes } from './Read';
import { SingleRecipe } from './SingleRecipe';
import { useUser } from './useUser';

export function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadRecipes() {
      try {
        const values = await readRecipes();
        setRecipes(values);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    if (user) loadRecipes();
    else setIsLoading(false);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (error)
    return (
      <div>
        Error Loading {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );

  return (
    <div>
      {!user && (
        <div className="card">
          <div className="card-body">
            <div className="m-2">
              <button
                className="btn btn-primary"
                onClick={() => navigate('sign-up')}>
                Sign Up
              </button>
            </div>
            <div className="m-2">
              <button
                className="btn btn-primary"
                onClick={() => navigate('sign-in')}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
      {user && (
        <div className="flex">
          <div className="row container-fluid">
            {recipes?.map((recipe) => (
              <div className="card col m-2" key={recipe.idMeal}>
                <Link
                  to={`/recipes/${recipe.idMeal}`}
                  className="card-body"
                  onClick={() => SingleRecipe}>
                  <div className="row">
                    <div className="col">
                      <img
                        className="img-thumbnail max-width: 50%"
                        src={recipe.strMealThumb}
                      />
                    </div>
                    <div className="col">
                      <h3>{recipe.strMeal}</h3>
                      <div className="row">
                        <div className="col">
                          <p>{recipe.ingredients}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p>{recipe.strInstructions}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
