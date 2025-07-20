import { Recipe } from "./recipeTypes.ts";

type Recipes = {
    data?: Map<string, Recipe>,
    status: "prefetch" | "ok" | "error",
    fromCache?: boolean,
    message?: string,
}

export default Recipes;