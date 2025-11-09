import { type Recipe, readARecipe } from './Read';
import { useParams } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { ShareRecipe } from './ShareRecipe';
import { readToken } from './data';

export function SingleRecipe() {
  const { idMeal } = useParams();
  const [recipe, setRecipe] = useState<Recipe>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
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

  async function makeSubstitutions(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const subSource = Array.from(formData);
      let sub = [];
      for (let j = 0; j < subSource.length; j++) {
        sub.push(subSource[j][1]);
      }
      if (!sub || sub.length <= 0) alert(`No substitutions were offered`);
      console.log('substitutes: ', sub);
      const baseline = await fetch(`/api/recipes/${idMeal}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${readToken()}`,
        },
      });
      if (!baseline) throw new Error(`Cannot find your desired recipe.`);
      const baseRecipe = (await baseline.json()) as Recipe;
      const baseIngredients = baseRecipe.ingredients;
      console.log('Baseline Ingredients: ', baseIngredients);
      if (!baseIngredients) {
        console.log(`No ingredients found.`);
        return;
      }
      for (let i = 0; i < baseIngredients?.length; i++) {
        if (sub[i] !== '') {
          baseIngredients.splice(
            i,
            1,
            `${baseIngredients[i]} or a similar amount of ${sub[i]}`
          );
        }
      }
      console.log(`Updated Ingredients: `, baseIngredients);
      const req = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(baseIngredients),
      };
      const result = await fetch(`/api/recipes/${idMeal}`, req);
      if (!result.ok) throw new Error(`PUT fetch error ${result.status}`);
      const newRecipe = (await result.json()) as Recipe;
      setShowForm(false);
      return newRecipe;
    } catch (err) {
      alert(`Cannot make a substitution. Error: ${err}.`);
      setShowForm(false);
    } finally {
      setIsLoading(false);
    }
  }

  function flipVisible() {
    if (showForm === false) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }

  let formVisible: string = '';
  if (showForm === true) {
    formVisible = 'table-danger-emphasis';
  } else {
    formVisible = 'visually-hidden';
  }

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
                <button
                  className="btn btn-secondary btn-lg m-2"
                  onClick={() => flipVisible()}>
                  Edit
                </button>
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
          <form id={`form-${idMeal}`} onSubmit={makeSubstitutions}>
            <div className="row">
              <table className="table table-danger table-striped table-responsive">
                <thead>
                  <tr className="table-danger">
                    <th scope="col">Name & Amount</th>
                    <th scope="col" className={formVisible}>
                      Substitutions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients?.map((ingredient) => (
                    <tr key={`ingredient ${ingredients.indexOf(ingredient)}`}>
                      <td>{ingredient}</td>
                      <td className={formVisible}>
                        <input
                          type="text"
                          name={`Substitute ${ingredient}`}
                          className="form-control"
                          id={`inputSubstitution${ingredient}`}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className={formVisible}>
                    <td>Save Your Substitutions?</td>
                    <td>
                      <button
                        type="submit" /* change to submit */
                        className="btn btn-outline-danger text-danger bg-white"
                        form={`form-${idMeal}`}>
                        Save
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
