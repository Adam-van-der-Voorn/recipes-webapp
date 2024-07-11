import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MyError from "../../general/placeholders/Error";
import { Recipe } from "../../types/recipeTypes";
import RecipeView from "../../recipie-view/RecipieView";
import { RecipesContext } from "../../contexts/RecipesContext";
import NotFound from "../../general/placeholders/NotFound";

function RecipePage() {
    const recipeId = useParams().recipeId;
    const { recipes, deleteRecipe } = useContext(RecipesContext);

    const navigate = useNavigate();

    if (recipeId === undefined) {
        console.error(`RecipePage: no recipe provided as param`);
        return <MyError message="Oops! Something went wrong." />;
    }

    const recipe: Recipe | undefined = recipes.data?.get(recipeId);

    if (recipe === undefined) {
        console.error("Recipe not found. Recipie data: ", recipes.data)
        return <NotFound message="This recipie does not exist :(" />;
    }
    const deleteAndNavigate = () => {
        let confirmation = window.confirm(`Are you sure you want to delete recipe '${recipe.name}'`);
        if (confirmation) {
            deleteRecipe(recipeId, () => {
                navigate(`/`);
            });
        }
    };

    return <div className="RecipePage">
        <RecipeView recipe={recipe} />
        <hr />
        <button onClick={() => navigate(`/edit-${recipeId}`)}>Edit</button>
        <button onClick={deleteAndNavigate}>Delete</button>
    </div>;
}

export default RecipePage;