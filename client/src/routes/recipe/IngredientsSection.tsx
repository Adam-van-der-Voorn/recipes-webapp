import { IngredientsSubList } from "../../types/recipeTypes.ts";
import { IngredientRow } from "./IngredientRow.tsx";
import { RecipeScaleData } from "./RecipePageContent.tsx";

type Props = {
  ingredients: IngredientsSubList[];
  scale: RecipeScaleData;
};

export function IngredientsSection(
  { ingredients, scale }: Props,
) {
  const hasMultipleLists = ingredients.length > 1;

  return (
    <section aria-details="recipe ingredients" className="ingredients">
      <div className="ingredientsQuantityScale">
        <label htmlFor="quantityScaleInput">Custom scale:</label>
        <input
          type="text"
          id="quantityScaleInput"
          placeholder="1"
          value={scale.inputStr}
          onInput={scale.onInput}
          inputMode="decimal"
        />
      </div>
      {ingredients.map((sublist, i) => {
        return (
          <SubList
            key={`sublist-${i}`}
            sublist={sublist}
            renderName={hasMultipleLists}
            scale={scale.val}
          />
        );
      })}
    </section>
  );
}

type IngredientsSubListProps = {
  sublist: IngredientsSubList;
  renderName: boolean;
  scale: number;
};

function SubList({ sublist, renderName, scale }: IngredientsSubListProps) {
  return (
    <>
      {renderName && <h2 className="ingredientListName">{sublist.name}</h2>}
      <ul className="ingredientViewList">
        {sublist.ingredients.map((ingredient, i) => {
          return (
            <IngredientRow
              key={`ingredient-${i}`}
              ingredient={ingredient}
              scale={scale}
            />
          );
        })}
      </ul>
    </>
  );
}
