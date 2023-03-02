import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Recipe } from "../../types/recipeTypes";
import MyError from "../../components-misc/MyError";
import { v4 as uuid4 } from 'uuid';
import RecipeForm from "../../recipe-form/components/RecipeForm";
import { IngredientListsInput, SubstitutionInput } from "../../types/RecipeInputTypes";
import quantityToString from "../../util/quantityToString";
import { RecipesContext } from "../../contexts/RecipesContext";
import NotFound from "../../components-misc/NotFound";

function EditRecipePage() {
    const recipeId = useParams().recipeId;
    const { editRecipe, recipes } = useContext(RecipesContext);
    const navigate = useNavigate();

    if (recipeId === undefined) {
        console.error(`EditRecipePage: no recipe provided as param`);
        return <MyError message="Oops! Something went wrong." />;
    }

    const doSubmit = (recipe: Recipe) => {
        editRecipe(recipe, recipeId, (id) => {
            navigate(`/view-${id}`, { replace: true });
        });
    };

    const recipe: Recipe | undefined = recipes.get(recipeId);
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
        servings: recipe.servings?.toString(10) || '',
        instructions: recipe.instructions || '',
        substitutions: substitutions,
    };

    return (
        <div className="EditRecipePage" aria-details="edit an existing recipie">
            <RecipeForm doSubmit={doSubmit} initialValues={initialValues} />
        </div>
    );
}

export default EditRecipePage;
