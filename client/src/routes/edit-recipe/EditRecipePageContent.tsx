import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Recipe } from "../../types/recipeTypes.ts";
import { v4 as uuid4 } from 'uuid';
import RecipeForm from "../../recipe-form/components/RecipeForm.tsx";
import { IngredientListsInput, SubstitutionInput } from "../../types/RecipeInputTypes.ts";
import quantityToString from "../../util/quantityToString.ts";
import { GlobalContext } from "../../contexts/GlobalContext.tsx";
import NotFound from "../../general/placeholders/NotFound.tsx";
import Loading from "../../general/placeholders/Loading.tsx";
import Error from "../../general/placeholders/Error.tsx";
import { ingredientInputsFromExistingRecipe } from "../../recipe-form/ingredientInputsFromExistingRecipe.ts";

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

    return <main aria-details="edit an existing recipe">
        <RecipeForm id={FORM_ID} onSubmit={doSubmit} initialValues={initialValues} />
    </main>;
}

export default EditRecipePageContent;
