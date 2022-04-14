import { Recipie, UnitVal } from "../../../types/recipieTypes";
import { useContext } from "react";
import { RecipiesContext } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import RecipieForm, { RecipieInputIngredients, RecipieInputSubstitutions } from "../../recipie-form/RecipieForm";

const unitValToString = (unitVal: UnitVal | undefined) => {
    if (unitVal !== undefined) {
        return `${unitVal.value} ${unitVal.unit}`;
    }
    else return '';
};

function EditRecipiePage() {
    const originalRecipieName = useParams().recipieName;
    const { editRecipie, recipies } = useContext(RecipiesContext);
    const navigate = useNavigate();

    if (originalRecipieName === undefined) {
        console.error(`EditRecipiePage: no recipie provided as param`);
        return null;
    }

    const doSubmit = (recipie: Recipie) => {
        editRecipie(recipie, originalRecipieName);
        navigate(`/${recipie.name}`, { replace: true });
    };

    const recipie = recipies.find(recipie => recipie.name === originalRecipieName);
    if (recipie === undefined) {
        console.error(`EditRecipiePage: recipie ${originalRecipieName} does not exist`);
        return null;
    }

    const ingredients: RecipieInputIngredients = recipie.ingredients
        ? {
            list: recipie.ingredients.lists
                .find(el => el.name === "Main")!.ingredients
                .map(ingredient => {
                    return {
                        name: ingredient.name,
                        quantity: unitValToString(ingredient.quantity),
                        percentage: ''
                    };
                }),
            anchor: recipie.ingredients.anchor!,
        }
        : {
            list: [],
            anchor: ''
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
        name: originalRecipieName,
        timeframe: recipie.timeframe || '',
        notes: recipie.notes || '',
        ingredients: ingredients,
        servings: unitValToString(recipie.servings),
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
