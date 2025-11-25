import React from "react"
import axios from "axios";
import ReactMarkdown from 'react-markdown';
export default function Body(){
const [error, seterror] = React.useState(null);
 const [ingredients, setingredients] = React.useState([])
  const [errorMessage, setErrorMessage] = React.useState("");
  const [recipe, setRecipe] = React.useState("");
  const [loading, setLoading] = React.useState(false);

   function cleanRecipe(raw) {
  // Remove ```html at start and ``` at end
  return raw.replace(/^```html\s*/i, "").replace(/```$/, "").trim();
}
  function SubmitForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newIngredient = formData.get("ingredient").trim().toLowerCase()
    const repetition = ingredients.some((ingredient) => ingredient === newIngredient)

    if(repetition){
        alert(` ${newIngredient} already added`)
    } else if(newIngredient){
            setingredients(prevIngredient => [...prevIngredient, newIngredient])
            e.target.reset(); 
    }
    else{
        alert("insert ingredient")
    }  
  }

  function Remove(index) {
    setingredients((prev) => prev.filter((_, i) => i !== index));
  }

   async function fetchRecipes(ingredients) {
  try{ 
    const response = await fetch("https://chef-backend-production.up.railway.app/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients })

  })
  

  if(!response.ok){
    const errorData = await response.json().catch(() => ({}));
    throw new Error (errorData.error || "failed to fetch recipes");
  }

   const rawText = await response.text();
    const cleaned = cleanRecipe(rawText);
    return cleaned;
}catch (error){
  console.error("Error fetching recipes:", error);
  throw error;
}
}
  

  const IngredientsList = ingredients.map((ingredient, index) => (
    <li key={index}>
      {ingredient}{" "}
      <button onClick={() => Remove(index)}>remove</button>
    </li>
  ));
  

  return (
    <main>
       <form 
       className="addIngredientForm"
       onSubmit={SubmitForm}
            >
                <input 
                type="text"
                placeholder="add ingredient"
                name="ingredient"
                 />
                <button> + ADD INGREDIENT</button>
            </form>
           

      {errorMessage && <i>{errorMessage}</i>}

      {ingredients.length ? (
        <section>
          <h2>Ingredients on hand:</h2>
          <ul>{IngredientsList}</ul>

          {IngredientsList.length > 3 && <div className="get-recipe-container">
                    <h3>Ready for some Recipe?</h3>
                    <p>Generate Recipe from your list of ingredients</p>
                    <button 
                     onClick={ async() => {
              setLoading(true);
              seterror(null);
              try{
                const recipetext = await fetchRecipes(ingredients);
                setRecipe(recipetext);
              }
                catch (error){seterror(error.message) || "failed fetcing ";}
              setLoading(false);
            }}
                    >{ loading ? "loading" : "Get a recipe" }</button>
            </div>}
        </section>
      ) : (
        <h3>Input at least four ingredients...</h3>
      )}

      {recipe && (
        <div style={{ marginTop: "20px" }}>
          <h2>Suggested Recipes:</h2>
          <ReactMarkdown>{recipe}</ReactMarkdown>
        </div>
      )}
    </main>
  );
}