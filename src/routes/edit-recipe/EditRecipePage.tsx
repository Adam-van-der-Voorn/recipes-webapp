import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Recipe } from "../../types/recipeTypes";
import MyError from "../../general/placeholders/Error";
import { v4 as uuid4 } from 'uuid';
import RecipeForm from "../../recipe-form/components/RecipeForm";
import { IngredientListsInput, SubstitutionInput } from "../../types/RecipeInputTypes";
import quantityToString from "../../util/quantityToString";
import { GlobalContext } from "../../contexts/GlobalContext";
import NotFound from "../../general/placeholders/NotFound";
import useRecipeStorage from "../../util/hooks/useRecipeStorage";

const headerStyle: React.CSSProperties = {
    gridTemplateColumns: 'auto 1fr auto',
};

const FORM_ID = "edit-recipie"

function EditRecipePage() {
    const recipeId = useParams().recipeId;
    const { db, user } = useContext(GlobalContext)
    const { editRecipe, recipes } = useRecipeStorage(db, user);

    const navigate = useNavigate();

    if (recipeId === undefined) {
        console.error(`EditRecipePage: no recipe provided as param`);
        return <MyError message="Oops! Something went wrong." />;
    }

    const doSubmit = (recipe: Recipe) => {
        editRecipe(recipe, recipeId, (id) => {
            navigate(`/view/${id}`, { replace: true });
        });
    };

    const recipe: Recipe | undefined = recipes.data?.get(recipeId);
    if (recipe === undefined) {
        return <NotFound message="This recipie does not exist :(" />;
    }

    const ingredients: IngredientListsInput = recipe.ingredients
        ? {
            lists: recipe.ingredients.lists
                .map(subIngredientList => {
                    return {
                        id: uuid4(),
                        name: subIngredientList.name,
                        ingredients: subIngredientList.ingredients.map(ingredient => {
                            return {
                                id: uuid4(),
                                name: ingredient.name,
                                quantity: quantityToString(ingredient.quantity),
                                optional: ingredient.optional,
                                percentage: ''
                            };
                        }),
                    };
                }),
            anchor: recipe.ingredients.anchor || 0
        }
        : {
            lists: [],
            anchor: 0
        };

    const substitutions: SubstitutionInput[] = recipe.substitutions || [];

    const initialValues = {
        name: recipe.name,
        timeframe: recipe.timeframe || '',
        makes: quantityToString(recipe.makes),
        notes: recipe.notes || '',
        ingredients: ingredients,
        servings: recipe.servings || '',
        instructions: recipe.instructions || '',
        substitutions: substitutions,
    };

    return <>
        <header style={headerStyle}>
            <Link to="/" className="headerLink">Home</Link>
            <h1 className="headerTitle">Edit Recipe</h1>
            <input type="submit" value="Save" form={FORM_ID} className="headerButton primary" />
        </header>
        <main className="recipeFormBody" aria-details="edit an existing recipie">
            <RecipeForm id={FORM_ID} onSubmit={doSubmit} initialValues={initialValues} />
        </main>
    </>
}

export default EditRecipePage;
