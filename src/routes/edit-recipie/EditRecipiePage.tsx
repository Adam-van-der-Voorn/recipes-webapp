import { useContext } from "react";
import { RecipiesContext } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import RecipieForm, { RecipieInputIngredients, RecipieInputSubstitutions } from "../../recipie-form/components/RecipieForm";
import { UnitVal, Recipie } from "../../types/recipieTypes";
import MyError from "../../components-misc/MyError";

const unitValToString = (unitVal: UnitVal | undefined) => {
    if (unitVal !== undefined) {
        return `${unitVal.value} ${unitVal.unit}`;
    }
    else return '';
};

function EditRecipiePage() {
    const recipieId = useParams().recipieId;
    const { editRecipie, recipies } = useContext(RecipiesContext);
    const navigate = useNavigate();

    if (recipieId === undefined) {
        console.error(`EditRecipiePage: no recipie provided as param`);
        return <MyError message="Oops! Something went wrong." />;
    }

    const doSubmit = (recipie: Recipie) => {
        editRecipie(recipie, recipieId, (id) => {
            navigate(`/view-${id}`, { replace: true });
        });
    };

    const recipie: Recipie | undefined = recipies.get(recipieId);
    if (recipie === undefined) {
        return null;
    }

    const ingredients: RecipieInputIngredients = recipie.ingredients
        ? {
            lists: recipie.ingredients.lists
                .map(subIngredientList => {
                    return {
                        name: subIngredientList.name,
                        ingredients: subIngredientList.ingredients.map(ingredient => {
                            return {
                                name: ingredient.name,
                                quantity: unitValToString(ingredient.quantity),
                                optional: ingredient.optional,
                                percentage: ''
                            };
                        }),
                    };
                }),
            anchor: recipie.ingredients.anchor || 0
        }
        : {
            lists: [],
            anchor: 0
        };


    const substitutions: RecipieInputSubstitutions = recipie.substitutions
        ? recipie.substitutions
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
        name: recipie.name,
        timeframe: recipie.timeframe || '',
        notes: recipie.notes || '',
        ingredients: ingredients,
        servings: recipie.servings?.toString(10) || '',
        instructions: recipie.instructions || [],
        substitutions: substitutions,
    };

    return (
        <div className="EditRecipiePage">
            <RecipieForm doSubmit={doSubmit} initialValues={initialValues} />
        </div>
    );
}

export default EditRecipiePage;
