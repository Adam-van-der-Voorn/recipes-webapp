import { Recipe } from "../types/recipeTypes";
import { parseUnitValInput } from "./parseUnitValInputs";
import { RecipeFormData } from "./components/RecipeForm";

export default function parseFormData(formData: RecipeFormData): Recipe {
    // parse form data
    const recipe: Recipe = {
        name: formData.name.trim(),
    };

    if (formData.servings !== '') {
        recipe.servings = parseFloat(formData.servings);
    }

    if (formData.timeframe !== '') {
        recipe.timeframe = formData.timeframe.trim();
    }

    if (formData.makes !== '') {
        recipe.makes = parseUnitValInput(formData.makes)!;
    }

    if (formData.notes !== '') {
        recipe.notes = formData.notes.trim();
    }

    if (formData.ingredients.lists.length > 0) {
        recipe.ingredients = {
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
            recipe.ingredients.anchor = formData.ingredients.anchor;
        }
    }

    if (formData.instructions.length > 0) {
        recipe.instructions = formData.instructions
            .map(instruction => instruction.instruction)
            // remove empty instructions
            .filter(instruction => instruction.trim() !== '');
    }

    if (formData.substitutions.length > 0) {
        const parseSubPart = (subPartInput: { quantity: string, ingredientName: string; }) => {
            return {
                ingredientName: subPartInput.ingredientName.trim(),
                ...(subPartInput.quantity !== '' && {quantity: parseUnitValInput(subPartInput.quantity)!}) 
            };
        };
        recipe.substitutions = formData.substitutions.map(substitution => {
            return {
                additions: substitution.additions.map(addition => parseSubPart(addition)),
                removals: substitution.removals.map(removal => parseSubPart(removal))
            };
        });
    }
    return recipe;
}