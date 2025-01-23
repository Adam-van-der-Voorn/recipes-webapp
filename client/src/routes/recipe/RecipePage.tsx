import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";
import AuthGate from "../../auth/AuthGate";
import { RecipePageContent } from "./RecipePageContent";

const headerStyle: React.CSSProperties = {
    gridTemplateColumns: 'auto 1fr auto auto',
};

function RecipePage() {
    const recipeId = useParams().recipeId;
    const { recipes, deleteRecipe } = useContext(GlobalContext);

    const navigate = useNavigate();

    let recipeName = "";
    if (recipeId) {
        recipeName = recipes.data?.get(recipeId)?.name ?? "";
    }
    else {
        console.warn("no recipe is provided as a URL param");
    }

    const deleteAndNavigate = () => {
        if (!recipeId) {
            return;
        }
        const iden = recipeName ?? recipeId;
        let confirmation = window.confirm(`Are you sure you want to delete recipe '${iden}'?`);
        if (confirmation) {
            deleteRecipe(recipeId, () => {
                navigate(`/`);
            });
        }
    };

    return <div className="page viewRecipePage">
        <header style={headerStyle}>
            <Link to="/" className="headerLink">Home</Link>
            <h1 className="headerTitle">{recipeName ?? ""}</h1>
            <Link to={`/edit/${recipeId}`} className="headerLink">Edit</Link>
            <button className="headerButton" onClick={deleteAndNavigate}>Delete</button>
        </header>
        <AuthGate>
            <RecipePageContent recipeId={recipeId} recipes={recipes} />
        </AuthGate>

    </div>;
}

export default RecipePage;