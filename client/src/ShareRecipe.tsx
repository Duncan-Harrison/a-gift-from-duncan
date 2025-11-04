import { useState, useEffect, FormEvent } from 'react';
import { readARecipeByName, type Recipe } from './Read';
import { readToken } from './data';
import { useNavigate } from 'react-router-dom';

export function ShareRecipe() {
  const [recipes, setRecipes] = useState<Recipe[]>();
  const navigate = useNavigate();

  useEffect(() => {
    async function shareYourRecipe(
      strMeal: string,
      username: string
    ): Promise<void> {
      try {
        const initialRecipe = readARecipeByName(strMeal);
        if (!initialRecipe) throw new Error(`Cannot find recipe.`);
        const userDestination = await fetch(`/api/users/${username}`, {
          method: 'GET',
        });
        if (!userDestination)
          throw new Error(`Cannot find your intended user.`);
        const sendRecipe = {
          method: 'POST',
          body: JSON.stringify(initialRecipe),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${readToken()}`,
            user: userDestination,
          },
        };
        const response = await fetch(`/api/recipes`, sendRecipe);
        if (!response.ok) throw new Error(`Recipe will not save at this time.`);
        const result = (await response.json()) as Recipe;
        alert(result.strMeal + ' has been saved to Your Recipes!');
        setRecipes([...recipes, result]);
      } catch (err) {
        console.error(err);
      }
    }
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const coreData = Object.fromEntries(formData);
      const coreUser = coreData.username;
      const coreRecipe = coreData.recipe;
      shareYourRecipe(coreRecipe, coreUser);
      alert(`Your recipe has been shared!`);
      navigate('/');
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="modal" tabIndex={-1}>
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
          <label htmlFor="recipe" className="form-label">
            Please confirm the name of the recipe you want to share.
            <input
              required
              name="recipe"
              type="test"
              className="form-control"
              id="inputRecipeName"
            />
          </label>
          <div className="row">
            <div className="col">
              <button type="submit" className="btn btn-primary">
                Share
              </button>
            </div>
            <div className="col">
              <button
                type="button"
                onClick={() => close()}
                className="btn btn-danger">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// export function SearchRecipe() {
//   const [ingredients, setIngredients] = useState<Ingredient[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [recipes, setRecipes] = useState<Recipe[]>([]);

//   useEffect(() => {
//     async function getIngredients(): Promise<void> {
//       try {
//         const ingred = await fetch(
//           'https://www.themealdb.com/api/json/v1/1/list.php?i=list',
//           {
//             method: 'GET',
//           }
//         );
//         if (!ingred.ok)
//           throw new Error(`Ingredient fetch error ${ingred.status}`);
//         const iList = await ingred.json();
//         const meals = iList.meals as Ingredient[];
//         if (meals && meals.length) setIngredients(meals);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     setIsLoading(true);
//     getIngredients();
//   }, []);

//   async function displayRecipes(ingredient: string) {
//     try {
//       const request = new Request(
//         `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`,
//         { method: 'GET' }
//       );
//       const response = await fetch(request);
//       if (!response.ok) throw new Error(`Response status: ${response.status}`);
//       const result = await response.json();
//       const resultRecipes = result.meals as Recipe[];
//       if (resultRecipes && resultRecipes.length) setRecipes(resultRecipes);
//       console.log(resultRecipes);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   async function saveRecipe(idMeal: string) {
//     try {
//       const initialRecipe = new Request(
//         `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`,
//         { method: 'GET' }
//       );
//       const preppedRecipeReq = await fetch(initialRecipe);
//       if (!preppedRecipeReq.ok) throw new Error(`Recipe could not be found.`);
//       const preppedRecipeRes = await preppedRecipeReq.json();
//       const preppedRecipe: Recipe = preppedRecipeRes.meals[0];
//       addIngredientsAndMeasurements(preppedRecipe);
//       console.log('preppedRecipe: ', preppedRecipe);
//       const savedRecipeReq = {
//         method: 'POST',
//         body: JSON.stringify(preppedRecipe),
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${readToken()}`,
//         },
//       };
//       const response = await fetch(`/api/recipes`, savedRecipeReq);
//       if (!response.ok) throw new Error(`Recipe will not save at this time.`);
//       const result = (await response.json()) as Recipe;
//       alert(result.strMeal + ' has been saved to Your Recipes!');
//       setRecipes([...recipes, result]);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   function addIngredientsAndMeasurements(recipe: Recipe): Recipe {
//     recipe.ingredients = [];
//     for (let i = 1; i <= 20; i++) {
//       const ingredientKey = `strIngredient${i}` as keyof Recipe;
//       const measureKey = `strMeasure${i}` as keyof Recipe;
//       const ingVal = recipe[ingredientKey];
//       const measVal = recipe[measureKey];
//       const ingredient = typeof ingVal === 'string' ? ingVal.trim() : '';
//       const measurement = typeof measVal === 'string' ? measVal.trim() : '';
//       if (ingredient) {
//         const entry = measurement
//           ? `${ingredient}, ${measurement}`
//           : ingredient;
//         recipe.ingredients.push(entry);
//       }
//     }
//     return recipe;
//   }

//   if (isLoading) return <div className="card-body">Loading...</div>;

//   function toSnakeCase(str: string): string {
//     return str
//       .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
//       .replace(/[\s]+/g, '_')
//       .toLowerCase();
//   }

//   function handleChange(event: any) {
//     const snakeFormat = toSnakeCase(event.target.value);
//     displayRecipes(snakeFormat);
//   }

//   return (
//     <div>
//       <div>
//         <select name="Ingredient Select" onChange={handleChange}>
//           <option value="">--Please choose an ingredient--</option>
//           {ingredients &&
//             ingredients.map((ing: Ingredient) => (
//               <option key={ing.idIngredient} value={ing.strIngredient}>
//                 {ing.strIngredient}
//               </option>
//             ))}
//           ;
//         </select>
//       </div>
//       {recipes?.length > 0 ? (
//         recipes?.map((r: Recipe) => (
//           <div className="card-body" key={r.idMeal}>
//             <div className="col">
//               <div className="row">
//                 <div className="col-4">
//                   <img
//                     src={r.strMealThumb}
//                     className="img-fluid"
//                     alt={r.strMeal}
//                   />
//                 </div>
//                 <div className="col-8">
//                   <h3>{r.strMeal}</h3>
//                   <button
//                     className="btn btn-primary"
//                     onClick={() => saveRecipe(r.idMeal)}>
//                     Save Recipe
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p>No recipes were found using this ingredient</p>
//       )}
//     </div>
//   );
// }
