import { type Recipe, readARecipe } from './Read';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ShareRecipe } from './ShareRecipe';

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
  const { strMeal, ingredients, strInstructions, strYoutube, strMealThumb } =
    recipe;

  return (
    <div className="mt-2">
      <div className="col container-fluid mt-5">
        <div className="row">
          <div className="col">
            <img
              src={strMealThumb}
              alt={strMeal}
              className="img-fluid width: 30% "
            />
          </div>
          <div className="col">
            <div className="row">
              <h2>{strMeal}</h2>
            </div>
            <div className="row col-6 mx-auto">
              <button
                className="btn btn-primary btn-lg m-2"
                onClick={() => ShareRecipe()}>
                Share
              </button>
              <button className="btn btn-secondary btn-lg m-2">Edit</button>
              <button className="btn btn-danger btn-lg m-2">Delete</button>
            </div>
          </div>
        </div>
        <div className="row mt-5">
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
                <th scope="col">Name & Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-default">
                <td>{ingredients ? ingredients[0] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? ingredients[1] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? ingredients[2] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? ingredients[3] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? ingredients[4] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? ingredients[5] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? ingredients[6] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? ingredients[7] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? ingredients[8] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? ingredients[9] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? ingredients[10] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? ingredients[11] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? ingredients[12] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? ingredients[13] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? ingredients[14] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? ingredients[15] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? ingredients[16] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? ingredients[17] : ''}</td>
              </tr>
              <tr className="table-default">
                <td>{ingredients ? ingredients[18] : ''}</td>
              </tr>
              <tr className="table-danger">
                <td>{ingredients ? ingredients[19] : ''}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
