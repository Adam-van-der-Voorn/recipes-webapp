import {
  IngredientsList as IngredientsListType,
  Substitution,
} from "../../types/recipeTypes.ts";
import { IngredientsSection } from "./IngredientsSection.tsx";
import { RecipeScaleData } from "./RecipePageContent.tsx";

type Props = {
  ingredients?: IngredientsListType;
  substitutions?: Substitution[];
  scale: RecipeScaleData;
};

function IngredientsTab(
  { ingredients, substitutions, scale }: Props,
) {
  const hasIngredients = ingredients !== undefined && ingredients.lists
        .flatMap((l) => l.ingredients)
        .length > 0;

  return (
    <div role="tabpanel" className="recipePageTabPanel">
      {hasIngredients
        ? (
          <IngredientsSection
            ingredients={ingredients.lists}
            scale={scale}
          />
        )
        : <p>This recipe has no ingredients 🤔</p>}
      {substitutions !== undefined && (
        <p>display of substitutions is not currently supported :(</p>
      )}
    </div>
  );
}

export default IngredientsTab;
