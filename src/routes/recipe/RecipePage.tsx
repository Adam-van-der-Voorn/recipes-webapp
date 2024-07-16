import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MyError from "../../general/placeholders/Error";
import { Recipe } from "../../types/recipeTypes";
import RecipeView from "../../recipie-view/RecipieView";
import { GlobalContext } from "../../contexts/GlobalContext";
import NotFound from "../../general/placeholders/NotFound";

const headerStyle: React.CSSProperties = {
    gridTemplateColumns: 'auto 1fr auto auto',
};

function RecipePage() {
    const recipeId = useParams().recipeId;
    const { recipes, deleteRecipe } = useContext(GlobalContext);

    const navigate = useNavigate();

    if (recipeId === undefined || recipes.status == "error") {
        console.error(`RecipePage: no recipe provided as param`);
        return <MyError message="Oops! Something went wrong." />;
    }

    if (recipes.status === "prefetch") {
        return null;
    }
    
    const recipe: Recipe | undefined = recipes.data?.get(recipeId);

    if (recipe === undefined) {
        console.error("Recipe not found. Recipie data: ", recipes.data);
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
        <header style={headerStyle}>
            <Link to="/" className="headerLink">Home</Link>
            <h1 className="headerTitle">{recipe.name}</h1>
            <Link to={`/edit/${recipeId}`} className="headerLink">Edit</Link>
            <button className="headerButton" onClick={deleteAndNavigate}>Delete</button>
        </header>
        <main className="recipePageBody">
            <RecipeView recipe={recipe} />
        </main>
    </div>;
}

export default RecipePage;