import { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Recipe } from "../../types/recipeTypes";
import RecipeForm from "../../recipe-form/components/RecipeForm";
import { v4 as uuid4 } from 'uuid';
import { RecipesContext } from "../../contexts/RecipesContext";

const headerStyle: React.CSSProperties = {
    gridTemplateColumns: 'auto 1fr auto',
};

const FORM_ID = "add-recipe"

function AddRecipePage() {
    const addRecipe = useContext(RecipesContext).addRecipe;
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);

    const doSubmit = (recipe: Recipe) => {
        addRecipe(recipe, (id) => {
            navigate(`/view/${id}`, { replace: true });
        });
    };

    const initialValues = {
        name: '',
        timeframe: '',
        makes: '',
        notes: '',
        ingredients: {
            lists: [{
                id: uuid4(),
                name: 'Main',
                ingredients: []
            }],
            anchor: 0
        },
        servings: '',
        instructions: '',
        substitutions: [],
    };

    return <>
        <header style={headerStyle}>
            <Link to="/" className="headerLink">Home</Link>
            <h1 className="headerTitle">New Recipe</h1>
            <input type="submit" value="Save" form={FORM_ID} className="headerButton primary" />
        </header>
        <main className="recipeFormBody" aria-details="add a new recipie">
            <RecipeForm id={FORM_ID} onSubmit={doSubmit} initialValues={initialValues} />
        </main>
    </>
}

export default AddRecipePage;
