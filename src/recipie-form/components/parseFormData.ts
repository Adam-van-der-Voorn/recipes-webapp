import { Recipie } from "../../types/recipieTypes";
import { parseUnitValInput } from "../parseUnitValInputs";
import { RecipieFormData } from "./RecipieForm";

export default function parseFormData(formData: RecipieFormData): Recipie {
    // parse form data
    const recipie: Recipie = {
        name: formData.name.trim(),
    };

    if (formData.servings !== '') {
        recipie.servings = parseFloat(formData.servings);
    }

    if (formData.timeframe !== '') {
        recipie.timeframe = formData.timeframe.trim();
    }

    if (formData.makes !== '') {
        recipie.makes = parseUnitValInput(formData.makes)!;
    }

    if (formData.notes !== '') {
        recipie.notes = formData.notes.trim();
    }

    if (formData.ingredients.lists.length > 0) {
        recipie.ingredients = {
            lists: formData.ingredients.lists.map(sublist => {
                return {
                    name: sublist.name,
                    ingredients: sublist.ingredients.flatMap((ingredient, idx) => {
                        // do not include dummy field in ingredients
                        if (idx === sublist.ingredients.length - 1) {
                            return [];
                        }
                        return [{
                            name: ingredient.name,
                            quantity: parseUnitValInput(ingredient.quantity)!,
                            optional: ingredient.optional
                        }];
                    })
                };
            })
        };
        if (formData.ingredients.anchor) {
            recipie.ingredients.anchor = formData.ingredients.anchor;
        }
    }

    if (formData.instructions.length > 0) {
        recipie.instructions = formData.instructions
            // remove empty instructions
            .flatMap(instruction => instruction.trim() !== '' ? [instruction] : []);
    }

    if (formData.substitutions.length > 0) {
        const parseSubPart = (subPartInput: { quantity: string, ingredientName: string; }) => {
            return {
                ingredientName: subPartInput.ingredientName.trim(),
                quantity: parseUnitValInput(subPartInput.quantity)!
            };
        };
        recipie.substitutions = formData.substitutions.map(substitution => {
            return {
                additions: substitution.additions.map(addition => parseSubPart(addition)),
                removals: substitution.removals.map(removal => parseSubPart(removal))
            };
        });
    }
    return recipie;
}