import convert, { Unit } from "convert-units";
import { UnitVal } from "../types/recipeTypes";
import { isSameMeasure } from "../util/units";

export const getQuantityFromPercentage = (anchorQuantity: UnitVal, subjectPercentage: number, subjectQuantity: UnitVal | undefined): UnitVal | undefined=> {
    const newValRelativeToAnchor = anchorQuantity.value * (subjectPercentage / 100);
    if (subjectQuantity) {
        if (anchorQuantity.unit === subjectQuantity.unit) {
            return { value: newValRelativeToAnchor, unit: subjectQuantity.unit };
        }
        else if (isSameMeasure(anchorQuantity.unit, subjectQuantity.unit)) {
            const newValOriginalUnit = convert(newValRelativeToAnchor)
                .from(anchorQuantity.unit as Unit)
                .to(subjectQuantity.unit as Unit);
            return { value: newValOriginalUnit, unit: subjectQuantity.unit };
        }
        else {
            return undefined;
        }
    }
    else {
        return { value: newValRelativeToAnchor, unit: anchorQuantity.unit };
    }
};
