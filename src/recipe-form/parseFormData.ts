import { Recipe } from "../types/recipeTypes";
import { RecipeInput, SubstitutionInput } from "../types/RecipeInputTypes";
import { parseUnitValInput } from "./parseUnitValInputs";

export default function parseFormData(formData: RecipeInput): Recipe {
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
            lists: formData.ingredients.lists.map(sublist => ({
                name: sublist.name,
                ingredients: sublist.ingredients.map((ingredient, idx) => ({
                    name: ingredient.name,
                    quantity: parseUnitValInput(ingredient.quantity)!,
                    optional: ingredient.optional
                }))
            }))
        };
        if (formData.ingredients.anchor) {
            recipe.ingredients.anchor = formData.ingredients.anchor;
        }
    }

    if (formData.instructions.length > 0) {
        recipe.instructions = formData.instructions
            .map(instruction => instruction.val)
            // remove empty instructions
            .filter(instruction => instruction.trim() !== '');
    }

    if (formData.substitutions.length > 0) {
        recipe.substitutions = formData.substitutions.map(substitution => parseSubstitution(substitution));
    }
    return recipe;
}

export function parseSubstitution(substitutionInput: SubstitutionInput) {
    return {
        additions: substitutionInput.additions.map(addition => ({
            ingredientName: addition.ingredientName.trim(),
            proportion: parseFloat(addition.proportion)
        })),
        removals: substitutionInput.removals
    };
}