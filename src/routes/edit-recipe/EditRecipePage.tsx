import { useContext } from "react";
import { RecipesContext } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { UnitVal, Recipe } from "../../types/recipeTypes";
import MyError from "../../components-misc/MyError";
import { v4 as uuid4 } from 'uuid';
import RecipeForm from "../../recipe-form/components/RecipeForm";
import { IngredientListsInput, InstructionInput, SubstitutionInput } from "../../types/RecipeInputTypes";

const unitValToString = (unitVal: UnitVal | undefined) => {
    if (unitVal !== undefined) {
        return `${unitVal.value} ${unitVal.unit}`;
    }
    else return '';
};

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
        return null;
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
                                quantity: unitValToString(ingredient.quantity),
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

    const instructions: InstructionInput[] = recipe.instructions
        ? recipe.instructions.map(instruction => ({ val: instruction }))
        : []


    const substitutions: SubstitutionInput[] = recipe.substitutions
        ? recipe.substitutions
            .map(substitution => {
                return {
                    additions: substitution.additions.map(addition => {
                        return {
                            quantity: unitValToString(addition.quantity),
                            ingredientName: addition.ingredientName
                        };
                    }),
                    removals: substitution.removals.map(removal => {
                        return {
                            quantity: unitValToString(removal.quantity),
                            ingredientName: removal.ingredientName
                        };
                    })
                };
            })
        : [];

    const initialValues = {
        name: recipe.name,
        timeframe: recipe.timeframe || '',
        makes: unitValToString(recipe.makes),
        notes: recipe.notes || '',
        ingredients: ingredients,
        servings: recipe.servings?.toString(10) || '',
        instructions: instructions,
        substitutions: substitutions,
    };

    return (
        <div className="EditRecipePage">
            <RecipeForm doSubmit={doSubmit} initialValues={initialValues} />
        </div>
    );
}

export default EditRecipePage;
