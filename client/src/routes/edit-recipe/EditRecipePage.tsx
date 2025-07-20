import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext.tsx";
import AuthGate from "../../auth/AuthGate.tsx";
import EditRecipePageContent from "./EditRecipePageContent.tsx";

const headerStyle: React.CSSProperties = {
    gridTemplateColumns: 'auto 1fr auto',
};

const FORM_ID = "edit-recipe";

function EditRecipePage() {
    const recipeId = useParams().recipeId;
    const { recipes } = useContext(GlobalContext);

    let isSaveButtonDisabled = (
        recipeId === undefined ||
        recipes.status !== "ok" ||
        recipes.data?.get(recipeId) === undefined
    );

    return <div className="page">
        <header style={headerStyle}>
            <Link to="/" className="headerLink">Home</Link>
            <h1 className="headerTitle">Edit Recipe</h1>
            <input type="submit" value="Save"
                disabled={isSaveButtonDisabled}
                form={FORM_ID}
                className="headerButton primary"
            />
        </header>
        <AuthGate>
            <EditRecipePageContent recipeId={recipeId} />
        </AuthGate>
    </div>;
}

export default EditRecipePage;
