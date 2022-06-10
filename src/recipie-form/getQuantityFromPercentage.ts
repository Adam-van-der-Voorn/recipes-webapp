import convert, { Unit } from "convert-units";
import { UnitVal } from "../types/recipieTypes";
import { isSameMeasure } from "../util/units";

export const getQuantityFromPercentage = (anchorQuantity: UnitVal, subjectPercentage: number, subjectQuantity: UnitVal | undefined) => {
    const newValRelativeToAnchor = anchorQuantity.value * (subjectPercentage / 100);
    if (subjectQuantity) {
        if (anchorQuantity.unit === subjectQuantity.unit) {
            return `${newValRelativeToAnchor} ${subjectQuantity.unit}`;
        }
        else if (isSameMeasure(anchorQuantity.unit, subjectQuantity.unit)) {
            const newValOriginalUnit = convert(newValRelativeToAnchor)
                .from(anchorQuantity.unit as Unit)
                .to(subjectQuantity.unit as Unit);
            return `${newValOriginalUnit} ${subjectQuantity.unit}`;
        }
    }
    else {
        return `${newValRelativeToAnchor} ${anchorQuantity.unit}`;
    }
};
