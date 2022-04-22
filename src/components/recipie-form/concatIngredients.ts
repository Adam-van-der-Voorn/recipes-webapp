import { RecipieFormData } from "./RecipieForm";

export const concatIngredients = (values: RecipieFormData) => values.ingredients.lists.flatMap(list => list.ingredients);