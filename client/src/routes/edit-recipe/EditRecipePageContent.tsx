import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Recipe } from "../../types/recipeTypes";
import { v4 as uuid4 } from 'uuid';
import RecipeForm from "../../recipe-form/components/RecipeForm";
import { IngredientListsInput, SubstitutionInput } from "../../types/RecipeInputTypes";
import quantityToString from "../../util/quantityToString";
import { GlobalContext } from "../../contexts/GlobalContext";
import NotFound from "../../general/placeholders/NotFound";
import Loading from "../../general/placeholders/Loading";
import Error from "../../general/placeholders/Error";
import { ingredientInputsFromExistingRecipe } from "../../recipe-form/ingredientInputsFromExistingRecipe";

const FORM_ID = "edit-recipe";

type Props = {
    recipeId: string | undefined;
};

function EditRecipePageContent({ recipeId }: Props) {
    const { editRecipe, recipes } = useContext(GlobalContext);

    const navigate = useNavigate();

    if (recipeId === undefined) {
        console.error(`EditRecipePage: no recipe provided as param`);
        return <Error message={`Something went wrong :(`} />;
    }

    if (recipes.status === "prefetch") {
        return <Loading message="Loading your recipe ..." />;
    }

    if (recipes.status === "error") {
        return <Error message={`Something went wrong :( ${recipes.message ?? ""}`} />;
    }

    const doSubmit = (recipe: Recipe) => {
        editRecipe(recipe, recipeId, (id) => {
            navigate(`/view/${id}`, { replace: true });
        });
    };

    const recipe: Recipe | undefined = recipes.data?.get(recipeId);
    if (recipe === undefined) {
        return <NotFound message="This recipe does not exist :(" />;
    }

    const initialValues = {
        name: recipe.name || '',
        timeframe: recipe.timeframe || '',
        makes: recipe.makes || '',
        notes: recipe.notes || '',
        ingredients: ingredientInputsFromExistingRecipe(recipe.ingredients),
        servings: recipe.servings || '',
        instructions: recipe.instructions || '',
        substitutions: recipe.substitutions || [],
    };

    return <main className="recipeFormBody" aria-details="edit an existing recipe">
        <RecipeForm id={FORM_ID} onSubmit={doSubmit} initialValues={initialValues} />
    </main>;
}

export default EditRecipePageContent;
