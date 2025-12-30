import { Ingredient } from "../../types/recipeTypes.ts";

type Props = {
  ingredient: Ingredient;
  scale: number;
};

export function IngredientRow({ ingredient, scale }: Props) {
  const optional = ingredient.optional
    ? <span className="ingredientOptionalTag">(optional)</span>
    : null;
  const quantity = ingredient.quantity;
  let quantityStr;
  if (typeof quantity === "string") {
    if (scale === 1) {
      quantityStr = quantity;
    } else {
      // we can't do math on a string, so just put the scale next to
      // the quantitiy to make it clear
      // undefined is "default" locale
      const scaleStr = new Intl.NumberFormat(undefined, {
        maximumSignificantDigits: 3,
      })
        .format(scale);
      quantityStr = `x${scaleStr} ${quantity}`;
    }
  } else if (typeof quantity === "number") {
    quantityStr = new Intl.NumberFormat(undefined, {
      maximumSignificantDigits: 3,
    })
      .format(quantity * scale);
  } else {
    const valueStr = new Intl.NumberFormat(undefined, {
      maximumSignificantDigits: 3,
    })
      .format(quantity.value * scale);
    quantityStr = `${valueStr} ${quantity.unit}`;
  }
  return (
    <>
      <li>{quantityStr}</li>
      <li className="ingredientName">{ingredient.name} {optional}</li>
    </>
  );
}
