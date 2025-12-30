import convert, { Unit } from "convert-units";
import { UnitVal } from "../types/recipeTypes.ts";
import { isSameMeasure } from "../util/units.ts";

export const getQuantityFromPercentage = (
  anchorQuantity: UnitVal | number,
  subjectPercentage: number,
  subjectUnit: string | undefined,
): UnitVal | number | undefined => {
  const proportion = subjectPercentage / 100;

  if (typeof anchorQuantity === "number") {
    return anchorQuantity * proportion;
  }

  const newValRelativeToAnchor = anchorQuantity.value * proportion;
  if (!subjectUnit || anchorQuantity.unit === subjectUnit) {
    return { value: newValRelativeToAnchor, unit: anchorQuantity.unit };
  }

  if (isSameMeasure(anchorQuantity.unit, subjectUnit)) {
    const newValOriginalUnit = convert(newValRelativeToAnchor)
      .from(anchorQuantity.unit as Unit)
      .to(subjectUnit as Unit);
    return { value: newValOriginalUnit, unit: subjectUnit };
  }

  return undefined;
};
