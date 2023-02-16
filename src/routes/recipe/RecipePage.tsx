import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MyError from "../../components-misc/MyError";
import { Recipe } from "../../types/recipeTypes";
import RecipeView from "../../recipie-view/RecipieView";
import { RecipesContext } from "../../contexts/RecipesContext";

function RecipePage() {
    const recipeId = useParams().recipeId;
    const { recipes, deleteRecipe } = useContext(RecipesContext);

    const navigate = useNavigate();

    if (recipeId === undefined) {
        console.error(`RecipePage: no recipe provided as param`);
        return <MyError message="Oops! Something went wrong." />;
    }

    const recipe: Recipe | undefined = recipes.get(recipeId);

    let content;
    if (recipe === undefined) {
        content = null;
    }
    else {
        const deleteAndNavigate = () => {
            let confirmation = window.confirm(`Are you sure you want to delete recipe '${recipe.name}'`);
            if (confirmation) {
                deleteRecipe(recipeId, () => {
                    navigate(`/`);
                });
            }
        };

        content = <>
            <RecipeView recipe={recipe} />
            <hr />
            <button onClick={() => navigate(`/edit-${recipeId}`)}>Edit</button>
            <button onClick={deleteAndNavigate}>Delete</button>     
        </>;
    }


    return (
        <div className="RecipePage">
            {content}
        </div>
    );
}

export default RecipePage;