import { FormEvent } from 'react';
import { readARecipe, type Recipe } from './Read';
import { readToken } from './data';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
type ShareRecipeProps = {
  show: boolean;
  recipeId: string | undefined;
  onClose: () => void;
};

export function ShareRecipe({ show, recipeId, onClose }: ShareRecipeProps) {
  const navigate = useNavigate();

  async function shareYourRecipe(
    idMeal: string,
    username: string
  ): Promise<void> {
    try {
      const initialRecipe = await readARecipe(idMeal);
      if (!initialRecipe) throw new Error(`Cannot find recipe.`);
      console.log('initial recipe: ', initialRecipe);
      const userDestination = await fetch(`/api/users/${username}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${readToken()}`,
        },
      });
      if (!userDestination) throw new Error(`Cannot find your intended user.`);
      const parse = await userDestination.json();
      console.log('parsed User :', parse);
      initialRecipe.userId = parse.userId;
      const sendRecipe = {
        method: 'POST',
        body: JSON.stringify(initialRecipe),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${readToken()}`,
        },
      };
      const response = await fetch(`/api/recipes/shared`, sendRecipe);
      if (!response.ok) throw new Error(`Recipe will not save at this time.`);
      const result = (await response.json()) as Recipe;
      alert(result.strMeal + ' has been shared with ' + username + '!');
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const coreData = Object.fromEntries(formData);
      const coreUser = coreData.username as string;
      if (recipeId) shareYourRecipe(recipeId, coreUser);
      alert(`Your recipe has been shared!`);
      navigate('/');
    } catch (err) {
      alert(err);
    }
  }

  return (
    <Modal show={show}>
      <div className="modal-header">
        <h2 className="modal-title">Share Your Recipe</h2>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="form-label">
            Please enter the username of the person you want to receive this
            recipe.
            <input
              required
              name="username"
              type="text"
              className="form-control"
              id="inputUsername"
            />
          </label>
          {/* <label htmlFor="recipe" className="form-label">
            Please confirm the name of the recipe you want to share.
            <input
              required
              name="recipe"
              type="test"
              className="form-control"
              id="inputRecipeName"
            />
          </label> */}
          <div className="row">
            <div className="col">
              <button type="submit" className="btn btn-primary">
                Share
              </button>
            </div>
            <div className="col">
              <button
                type="button"
                onClick={() => onClose()}
                className="btn btn-danger">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
