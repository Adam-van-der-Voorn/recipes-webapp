import { useState } from "react";
import { c } from "../../util/buildClassName.ts";
import IngredientsTab from "./IngredientsTab.tsx";
import InstructionsTab from "./InstructionsTab.tsx";
import { Recipe } from "../../types/recipeTypes.ts";
import Recipes from "../../types/Recipes.ts";
import Loading from "../../general/placeholders/Loading.tsx";
import Error from "../../general/placeholders/Error.tsx";
import NotFound from "../../general/placeholders/NotFound.tsx";
import { MetaDataSection } from "./MetaDataSection.tsx";

type Props = {
  recipeId: string | undefined;
  recipes: Recipes;
};

export type RecipeScaleData = {
  val: number;
  inputStr: string;
  onInput: (ev: any) => void;
};

export function RecipePageContent({ recipeId, recipes }: Props) {
  const [tab, setTab] = useState<"ingredients" | "instuctions">("ingredients");
  const [scaleInputStr, setScaleInputStr] = useState("");
  const [scaleVal, setScaleVal] = useState(1);

  if (recipeId === undefined) {
    return <Error message={`Something went wrong :(`} />;
  }

  if (recipes.status === "prefetch") {
    return <Loading message="Loading your recipe ..." />;
  }

  if (recipes.status === "error") {
    return (
      <Error message={`Something went wrong :( ${recipes.message ?? ""}`} />
    );
  }

  const recipe: Recipe | undefined = recipes.data?.get(recipeId);

  if (recipe === undefined) {
    console.error("Recipe not found. Recipe data: ", recipes.data);
    return (
      <NotFound message={`The recipe with id ${recipeId} does not exist :(`} />
    );
  }

  const hasMetaData = recipe.servings !== undefined ||
    recipe.makes !== undefined || recipe.timeframe !== undefined;

  const onScaleInput = (ev: any) => {
    const inp = ev.target.value;
    if (inp === "") {
      setScaleInputStr(inp);
      setScaleVal(1);
    }
    const valid = /^[\.0-9]*$/;
    if (valid.test(inp)) {
      setScaleInputStr(inp);
    }
    const num = parseFloat(inp);
    console.log(inp, num);
    if (!isNaN(num) && num !== 0) {
      setScaleVal(num);
    }
  };

  return (
    <>
      <main>
        <div className="recipePageMainContent">
          <div className="recipeTitle">
            <h1>{recipe.name}</h1>
            {hasMetaData
              ? (
                <MetaDataSection
                  servings={recipe.servings}
                  makes={recipe.makes}
                  timeframe={recipe.timeframe}
                />
              )
              : null}
          </div>

          {tab === "ingredients"
            ? (
              <IngredientsTab
                ingredients={recipe.ingredients}
                substitutions={recipe.substitutions}
                scale={{
                  val: scaleVal,
                  inputStr: scaleInputStr,
                  onInput: onScaleInput,
                }}
              />
            )
            : (
              <InstructionsTab
                instructions={recipe.instructions}
                notes={recipe.notes}
              />
            )}
        </div>
      </main>
      <div role="tablist" className="tabBar">
        <button
          role="tab"
          className={c("tab", tab === "ingredients" ? "active" : null)}
          onClick={() => setTab("ingredients")}
        >
          Ingredients
        </button>
        <button
          role="tab"
          className={c("tab", tab === "instuctions" ? "active" : null)}
          onClick={() => setTab("instuctions")}
        >
          Instructions
        </button>
      </div>
    </>
  );
}
