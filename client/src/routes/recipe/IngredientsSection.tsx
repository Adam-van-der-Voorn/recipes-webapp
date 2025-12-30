import { useState } from "react";
import { IngredientsSubList } from "../../types/recipeTypes.ts";
import { IngredientRow } from "./IngredientRow.tsx";

type Props = {
  ingredients: IngredientsSubList[];
};

export function IngredientsSection({ ingredients }: Props) {
  const [scaleStr, setScaleStr] = useState("");
  const [scale, setScale] = useState(1);

  const hasMultipleLists = ingredients.length > 1;

  const onScaleInput = (ev: any) => {
    const inp = ev.target.value;
    if (inp === "") {
      setScaleStr(inp);
      setScale(1);
    }
    const valid = /^[\.0-9]*$/;
    if (valid.test(inp)) {
      setScaleStr(inp);
    }
    const num = parseFloat(inp);
    console.log(inp, num);
    if (!isNaN(num) && num !== 0) {
      setScale(num);
    }
  };

  return (
    <section aria-details="recipe ingredients" className="ingredients">
      <div className="ingredientsQuantityScale">
        <label htmlFor="quantityScaleInput">Custom scale:</label>
        <input
          type="text"
          id="quantityScaleInput"
          placeholder="1"
          value={scaleStr}
          onInput={onScaleInput}
          inputMode="decimal"
        />
      </div>
      {ingredients.map((sublist, i) => {
        return (
          <SubList
            key={`sublist-${i}`}
            sublist={sublist}
            renderName={hasMultipleLists}
            scale={scale}
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
