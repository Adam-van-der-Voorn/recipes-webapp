import { Recipe } from "./recipeTypes";

type Recipes = {
    data?: Map<string, Recipe>,
    status: "prefetch" | "ok" | "error",
    fromCache?: boolean,
    message?: string,
}

export default Recipes;