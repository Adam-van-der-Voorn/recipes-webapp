import { Recipe } from "../types/recipeTypes";
import { RecipeInput } from "../types/RecipeInputTypes";
import { parseIngredientQuantity } from "./parseUnitValInputs";

export default function parseFormData(formData: RecipeInput): Recipe {
    // parse form data
    const recipe: Recipe = {
        name: formData.name.trim(),
    };

    if (formData.servings !== '') {
        recipe.servings = formData.servings;
    }

    if (formData.timeframe !== '') {
        recipe.timeframe = formData.timeframe.trim();
    }

    if (formData.makes !== '') {
        recipe.makes = formData.makes.trim();
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
                    quantity: parseIngredientQuantity(ingredient.quantity),
                    optional: ingredient.optional
                }))
            }))
        };
        if (formData.ingredients.anchor) {
            // seems hook-form makes all fields string on submit
            // program defensively anyway
            const anchor = typeof formData.ingredients.anchor === 'string'
                ? parseInt(formData.ingredients.anchor)
                : formData.ingredients.anchor
            recipe.ingredients.anchor = anchor;
        }
    }

    if (formData.instructions !== '') {
        recipe.instructions = formData.instructions
    }

    if (formData.substitutions.length > 0) {
        recipe.substitutions = formData.substitutions
    }
    return recipe;
}