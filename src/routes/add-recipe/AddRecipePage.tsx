import { useContext } from "react";
import { RecipesContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Recipe } from "../../types/recipeTypes";
import RecipeForm from "../../recipe-form/components/RecipeForm";
import { v4 as uuid4 } from 'uuid';

function AddRecipePage() {
    const addRecipe = useContext(RecipesContext).addRecipe;
    const navigate = useNavigate();

    const doSubmit = (recipe: Recipe) => {
        addRecipe(recipe, (id) => {
            navigate(`/view-${id}`, { replace: true });
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
        instructions: [],
        substitutions: [],
    };

    return (
        <div className="AddRecipePage">
            <RecipeForm doSubmit={doSubmit} initialValues={initialValues} />
        </div>
    );
}

export default AddRecipePage;
