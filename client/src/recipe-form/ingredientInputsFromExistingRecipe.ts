import { Recipe } from "../types/recipeTypes";
import { v4 as uuid4 } from 'uuid';
import quantityToString from "../util/quantityToString";

export function ingredientInputsFromExistingRecipe(ingredients: Recipe['ingredients']) {
    return ingredients
        ? {
            lists: ingredients.lists
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
            anchor: ingredients.anchor || 0
        }
        : {
            lists: [],
            anchor: 0
        };
}