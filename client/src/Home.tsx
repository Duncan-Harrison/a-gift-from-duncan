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
    loadRecipes();
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
        <div className="flex">
          <div>
            <button className="btn" onClick={() => navigate('sign-up')}>
              Sign Up
            </button>
          </div>
          <div>
            <button className="btn" onClick={() => navigate('sign-in')}>
              Sign In
            </button>
          </div>
        </div>
      )}
      {user && (
        <div className="flex">
          {recipes?.map((recipe) => (
            <Link
              to={`/details/${recipe.idMeal}`}
              key={recipe.idMeal}
              className="Card"
              onClick={SingleRecipe}>
              <img className="card-picture" src={recipe.strMealThumb} />
              <h3>{recipe.strMeal}</h3>
              <div>
                <p>{recipe.measurements}</p>
                <p>{recipe.ingredients}</p>
              </div>
              <p>{recipe.strInstructions}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
