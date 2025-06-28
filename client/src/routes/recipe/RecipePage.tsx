import { useContext, useEffect } from "react";
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

    const editKeyboardShortcut = (ev: any) => {
        if (ev.code === "KeyE" && recipeId) {
            navigate(`/edit/${recipeId}`)
        }
    }

    useRegisterHackyKeyboardShortcut(editKeyboardShortcut);

    return <div className="page viewRecipePage">
        <header style={headerStyle}>
            <Link to="/" className="headerLink">Home</Link>
            <Link to={`/edit/${recipeId}`} className="headerLink">Edit</Link>
            <button className="headerButton" onClick={deleteAndNavigate}>Delete</button>
        </header>
        <AuthGate>
            <RecipePageContent recipeId={recipeId} recipes={recipes} />
        </AuthGate>

    </div>;
}

/**
 * This does work, but the key event is caught BEFORE any input events, meaning
 * that we cannot catch an input event and not trigger a shortcut. This is fine
 * In this case, but not really "good".
 * 
 * I suspect that this happens because of this mix of "Synthetic" react events
 * and real dom events.
 * 
 * I made a working non-react POC here:
 * https://jsfiddle.net/x7hc5g4z/29/
 * */
function useRegisterHackyKeyboardShortcut(handler: (ev: any) => void) {
    useEffect(() => {
        const opts: AddEventListenerOptions = {
            capture: false,
            passive: true
        }
        
        document.body.addEventListener('keydown', handler, opts);
        return () => {
            document.body.removeEventListener('keydown', handler, opts)
        }
    }, [handler])

}

export default RecipePage;