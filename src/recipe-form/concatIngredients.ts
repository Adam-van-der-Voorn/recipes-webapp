import { RecipeFormData } from "./components/RecipeForm";

export const concatIngredients = (values: RecipeFormData) => values.ingredients.lists.flatMap(list => list.ingredients);