import { type Recipe, readARecipe } from './Read';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
      const sub = [];
      for (let j = 0; j < subSource.length; j++) {
        sub.push(subSource[j][1]);
      }
      if (!sub || sub.length <= 0) alert(`No substitutions were offered`);
      console.log('substitutes: ', sub);
      const baseIngredients = recipe?.ingredients;
      if (!baseIngredients) {
        console.log(`No Ingredients found`);
        return;
      }
      for (let i = 0; i < baseIngredients?.length; i++) {
        const substitution = sub[i];
        if (substitution !== '') {
          baseIngredients.splice(
            i,
            1,
            `${substitution}, or ${baseIngredients[i]}`
          );
          const wordCount = baseIngredients[i].split(/\s+/);
          console.log(wordCount);
          const uniqueWords = new Set(wordCount);
          console.log(uniqueWords);
          const newWords = Array.from(uniqueWords);
          console.log(newWords);
          const lastWords = newWords.join(' ');
          console.log(lastWords);
          baseIngredients.splice(i, 1, lastWords);
        }
      }
      console.log(`Updated Ingredients: `, baseIngredients);
      const req = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${readToken()}`,
        },
        body: JSON.stringify({ ingredients: baseIngredients }),
      };
      const result = await fetch(`/api/recipes/${idMeal}`, req);
      if (!result.ok) throw new Error(`PUT fetch error ${result.status}`);
      const newRecipe = (await result.json()) as Recipe;
      setRecipe(newRecipe);
      setShowForm(false);
      return newRecipe;
    } catch (err) {
      alert(`Cannot make a substitution. Error: ${err}.`);
      setShowForm(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteRecipe(id: string) {
    try {
      const req = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${readToken()}`,
        },
      };
      const res = await fetch(`/api/recipes/${id}`, req);
      if (!res.ok) throw new Error(`Fetch Error ${res.status}`);
      await navigate('/');
      return res;
    } catch (err) {
      setError(err);
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
              <h2>{strMeal}</h2>
              <img
                src={strMealThumb}
                alt={strMeal}
                className="img-thumbnail my-2"
              />
              <div className="row mx-auto">
                <div className="col-4">
                  <button
                    className="btn btn-primary btn-lg m-2"
                    onClick={() => setShowModal(true)}>
                    Share
                  </button>
                </div>
                <div className="col-4">
                  <button
                    className="btn btn-secondary btn-lg m-2"
                    onClick={() => flipVisible()}>
                    Edit
                  </button>
                </div>
                <div className="col-4">
                  <button
                    className="btn btn-danger btn-lg m-2"
                    onClick={() => {
                      if (idMeal) deleteRecipe(idMeal);
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div className="col">
              <p className="mt-5">{strInstructions}</p>
            </div>
          </div>
          <div className="row spacer my-3"></div>
          <div className="row justify-content-center my-3">
            <div className="col-5">
              {strYoutube ? (
                <button
                  onClick={() => window.open(`${strYoutube}`, '_blank')}
                  className="btn btn-primary">
                  Watch Tutorial
                </button>
              ) : (
                <p></p>
              )}
            </div>
          </div>

          <div className="row mb-2">
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
