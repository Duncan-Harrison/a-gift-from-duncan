import { type Recipe, readARecipe } from './Read';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ShareRecipe } from './ShareRecipe';

export function SingleRecipe() {
  const { idMeal } = useParams();
  const [recipe, setRecipe] = useState<Recipe>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [showModal, setShowModal] = useState(false);
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

  async function makeSubstitutions() {} //splice method to make change; or access value of ingredient with square bracket notation and then concatenate

  if (isLoading) return <div>Loading</div>;
  if (error || !recipe) {
    return <div>Error Loading Recipe</div>;
  }
  const { strMeal, ingredients, strInstructions, strYoutube, strMealThumb } =
    recipe;

  return (
    <>
      <ShareRecipe
        show={showModal}
        recipeId={idMeal}
        onClose={() => setShowModal(false)}
      />
      <div className="mt-2">
        <div className="col container-fluid mt-5">
          <div className="row">
            <div className="col">
              <img
                src={strMealThumb}
                alt={strMeal}
                className="img-thumbnail width: 30% "
              />
            </div>
            <div className="col">
              <div className="row">
                <h2>{strMeal}</h2>
              </div>
              <div className="row col-6 mx-auto">
                <button
                  className="btn btn-primary btn-lg m-2"
                  onClick={() => setShowModal(true)}>
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
            <table className="table table-danger table-striped">
              <thead>
                <tr className="table-danger">
                  <th scope="col">Name & Amount</th>
                  <th scope="col">Replacements</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {ingredients?.map((ingredient) => (
                  <tr key={ingredient}>
                    <td>{ingredient}</td>
                    <td>
                      <form
                        id={`form-${ingredient}`}
                        /* onSubmit={} */
                      >
                        <input type="text" />
                      </form>
                    </td>
                    <td>
                      <button
                        type="button" /* change to submit */
                        className="btn text-danger bg-white"
                        form={`form-${ingredient}`}>
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
