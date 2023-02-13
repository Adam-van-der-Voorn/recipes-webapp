import { UnitVal } from "../types/recipeTypes";

export default function quantityToString(quantity: UnitVal | number | undefined): string {
    if (!quantity) {
        return '';
    }

    if (typeof quantity === 'number') {
        return `${quantity}`;
    }

    return `${quantity.value} ${quantity.unit}`;
};