import { useEffect, useState } from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { type Recipe, readRecipes } from './Read';
import { SingleRecipe } from './SingleRecipe';
import { useUser } from './useUser';
import { AutoFillRecipe } from './AutoFillRecipe';

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
        if (values.length < 1) {
          const firstRecipe = await AutoFillRecipe();
          if (firstRecipe) values.unshift(firstRecipe);
        }
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
          <div className="col-12 card-body">
            <div className="row">
              <div className="col-sm-5 m-1">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('sign-up')}>
                  Sign Up
                </button>
              </div>
              <div className="col-sm-5 m-1">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('sign-in')}>
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {user && (
        <div className="flex">
          <div className="row container justify-content-around gap-3">
            {recipes?.map((recipe) => (
              <div className="card col-md-3" key={recipe.idMeal}>
                <Link
                  to={`/recipes/${recipe.idMeal}`}
                  className="card-body"
                  onClick={() => SingleRecipe}>
                  <div className="row">
                    <div className="col">
                      <img className="img-fluid" src={recipe.strMealThumb} />
                    </div>
                    <div className="col">
                      <p>{recipe.strMeal}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
