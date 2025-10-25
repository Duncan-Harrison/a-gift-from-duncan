import { type Recipe, readARecipe } from './Read';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function SingleRecipe() {
  const { idMeal } = useParams();
  const [recipe, setRecipe] = useState<Recipe>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function loadRecipe(idMeal: string) {
      try {
        const product = (await readARecipe(idMeal)) as Recipe;
        setRecipe(product);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (idMeal) {
      setIsLoading(true);
      loadRecipe(idMeal);
    }
  }, [idMeal]);

  if (isLoading) return <div>Loading</div>;
  if (error || !recipe) {
    return <div>Error Loading Recipe</div>;
  }
  const {
    strMeal,
    ingredients,
    measurements,
    strInstructions,
    strYoutube,
    strMealThumb,
  } = recipe;

  return (
    <div>
      <div className="col">
        <div className="row">
          <div className="col">
            <img src={strMealThumb} alt={strMeal} className="image" />
          </div>
          <div className="col">
            <div className="row">
              <h2>{strMeal}</h2>
            </div>
            <div className="row">
              <button className="btn btn-primary">Share</button>
              <button className="btn btn-secondary">Edit</button>
              <button className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
        <div className="row">
          <p>{strInstructions}</p>
          {strYoutube ? (
            <p>
              <a href={strYoutube}>Watch Tutorial</a>
            </p>
          ) : (
            <p></p>
          )}
        </div>
        <div className="row">
          <h3>Ingredients</h3>
        </div>
        <div className="row">
          <table>
            <thead>
              <tr className="table-danger">
                <th scope="col">Name</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-default">
                <td>{ingredients ? [0] : ''}</td>
                <td>{measurements ? [0] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? [1] : ''}</td>
                <td>{measurements ? [1] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? [2] : ''}</td>
                <td>{measurements ? [2] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? [3] : ''}</td>
                <td>{measurements ? [3] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? [4] : ''}</td>
                <td>{measurements ? [4] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? [5] : ''}</td>
                <td>{measurements ? [5] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? [6] : ''}</td>
                <td>{measurements ? [6] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? [7] : ''}</td>
                <td>{measurements ? [7] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? [8] : ''}</td>
                <td>{measurements ? [8] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? [9] : ''}</td>
                <td>{measurements ? [9] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? [10] : ''}</td>
                <td>{measurements ? [10] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? [11] : ''}</td>
                <td>{measurements ? [11] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? [12] : ''}</td>
                <td>{measurements ? [12] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? [13] : ''}</td>
                <td>{measurements ? [13] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? [14] : ''}</td>
                <td>{measurements ? [14] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? [15] : ''}</td>
                <td>{measurements ? [15] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? [16] : ''}</td>
                <td>{measurements ? [16] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? [17] : ''}</td>
                <td>{measurements ? [17] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? [18] : ''}</td>
                <td>{measurements ? [18] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? [19] : ''}</td>
                <td>{measurements ? [19] : ''}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
