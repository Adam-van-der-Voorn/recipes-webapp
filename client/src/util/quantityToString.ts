import { IngredientQuantity } from "../types/recipeTypes.ts";

export default function quantityToString(quantity: IngredientQuantity): string {
    if (!quantity) {
        return '';
    }

    if (typeof quantity === 'number') {
        return `${quantity}`;
    }

    if (typeof quantity === 'string') {
        return quantity;
    }

    return `${quantity.value} ${quantity.unit}`;
};