import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MyError from "../../general/placeholders/Error";
import { Recipe } from "../../types/recipeTypes";
import InstructionsTab from "./InstructionsTab";
import { GlobalContext } from "../../contexts/GlobalContext";
import NotFound from "../../general/placeholders/NotFound";
import AuthGate from "../../auth/AuthGate";
import IngredientsTab from "./IngredientsTab";
import { c } from "../../util/buildClassName";

const headerStyle: React.CSSProperties = {
    gridTemplateColumns: 'auto 1fr auto auto',
    boxShadow: "none", // as the tab bar is underneath
};

function RecipePage() {
    const recipeId = useParams().recipeId;
    const { recipes, deleteRecipe } = useContext(GlobalContext);
    const [tab, setTab] = useState<"ingredients" | "instuctions">("ingredients");

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
        <div role="tablist" className="tabBar">
            <button role="tab"
                className={c("tab", tab === "ingredients" ? "active" : null)}
                onClick={() => setTab("ingredients")}
            >Ingredients
            </button>
            <button role="tab"
                className={c("tab", tab === "instuctions" ? "active" : null)}
                onClick={() => setTab("instuctions")}
            >Instructions
            </button>
        </div>
        <AuthGate>
            <main className="recipePageBody">
                {tab === "ingredients"
                    ? <IngredientsTab ingredients={recipe.ingredients}
                        substitutions={recipe.substitutions}
                        makes={recipe.makes}
                        servings={recipe.servings}
                        timeframe={recipe.timeframe}
                    />
                    : <InstructionsTab instructions={recipe.instructions}
                        notes={recipe.notes}
                    />
                }
            </main>
        </AuthGate>
    </div>;
}

export default RecipePage;