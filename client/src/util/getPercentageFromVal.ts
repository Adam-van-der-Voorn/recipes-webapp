import convert, { Unit } from "convert-units";
import { IngredientInput } from "../types/RecipeInputTypes.ts";
import { isConvertableUnit, isSameMeasure } from "./units.ts";
import { parseIngredientQuantity } from "../recipe-form/parseUnitValInputs.ts";

export default function getPercentageFromVal(
  subject: IngredientInput,
  anchor: IngredientInput,
): number | undefined {
  const anchorQuantity = parseIngredientQuantity(anchor.quantity);
  const subjectQuantity = parseIngredientQuantity(subject.quantity);

  const anchorIsString = typeof anchorQuantity === "string";
  const subjectIsString = typeof subjectQuantity === "string";

  if (anchorIsString || subjectIsString) {
    // we can't do anything with strings :(
    return undefined;
  }

  const anchorIsNum = typeof anchorQuantity === "number";
  const subjectIsNum = typeof subjectQuantity === "number";
  if (anchorIsNum || subjectIsNum) {
    if (anchorIsNum && subjectIsNum) {
      return (subjectQuantity / anchorQuantity) * 100;
    } else return undefined;
  }

  // check that quanities can be converted between
  if (!isSameMeasure(anchorQuantity.unit, subjectQuantity.unit)) {
    return undefined;
  }

  if (isConvertableUnit(subjectQuantity.unit)) {
    const subjectValNormalised: number = convert(subjectQuantity.value)
      .from(subjectQuantity.unit as Unit)
      .to(anchorQuantity.unit as Unit);
    return (subjectValNormalised / anchorQuantity.value) * 100;
  } else {
    return (subjectQuantity.value / anchorQuantity.value) * 100;
  }
}
