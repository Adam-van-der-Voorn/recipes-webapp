import { Recipe } from "./recipeTypes";

type Recipies = {
    data?: Map<string, Recipe>,
    status: "prefetch" | "ok" | "error",
    fromCache?: boolean,
    message?: string,
}

export default Recipies;