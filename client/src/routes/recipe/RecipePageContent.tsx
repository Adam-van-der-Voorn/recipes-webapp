import { useState } from "react";
import { c } from "../../util/buildClassName";
import IngredientsTab from "./IngredientsTab";
import InstructionsTab from "./InstructionsTab";
import { Recipe } from "../../types/recipeTypes";
import Recipes from "../../types/Recipes";
import Loading from "../../general/placeholders/Loading";
import Error from "../../general/placeholders/Error";
import NotFound from "../../general/placeholders/NotFound";
import { MetaDataSection } from "./MetaDataSection";

type Props = {
    recipeId: string | undefined
    recipes: Recipes
};

export function RecipePageContent({ recipeId, recipes }: Props) {
    const [tab, setTab] = useState<"ingredients" | "instuctions">("ingredients");

    if (recipeId === undefined) {
        return <Error message={`Something went wrong :(`} />;
    }

    if (recipes.status === "prefetch") {
        return <Loading message="Loading your recipe ..." />;
    }

    if (recipes.status === "error") {
        return <Error message={`Something went wrong :( ${recipes.message ?? ""}`} />;
    }

    const recipe: Recipe | undefined = recipes.data?.get(recipeId);

    if (recipe === undefined) {
        console.error("Recipe not found. Recipe data: ", recipes.data);
        return <NotFound message={`The recipe with id ${recipeId} does not exist :(`} />;
    }

    const hasMetaData = recipe.servings !== undefined || recipe.makes !== undefined || recipe.timeframe !== undefined;        

    return <>
        <main>
            <div className="recipePageMainContent">
                <div className="recipeTitle">
                    <h1>{recipe.name}</h1>
                    {hasMetaData
                        ? <MetaDataSection servings={recipe.servings} makes={recipe.makes} timeframe={recipe.timeframe} />
                        : null
                    }
                </div>
                
                {tab === "ingredients"
                    ? <IngredientsTab ingredients={recipe.ingredients}
                        substitutions={recipe.substitutions}
                        makes={recipe.makes}
                        servings={recipe.servings}
                        timeframe={recipe.timeframe}
                    />
                    : <InstructionsTab instructions={recipe.instructions}
                        notes={recipe.notes}
                    />
                }
            </div>
        </main>
        <div role="tablist" className="tabBar">
            <button role="tab"
                className={c("tab", tab === "ingredients" ? "active" : null)}
                onClick={() => setTab("ingredients")}
            >Ingredients
            </button>
            <button role="tab"
                className={c("tab", tab === "instuctions" ? "active" : null)}
                onClick={() => setTab("instuctions")}
            >Instructions
            </button>
        </div>
    </>;
}