import convert, { Unit } from "convert-units";
import { RecipeInputIngredient } from "../recipe-form/components/RecipeForm";
import { parseUnitValInputs } from "../recipe-form/parseUnitValInputs";
import { UnitVal } from "../types/recipeTypes";
import { isSameMeasure, isConvertableUnit } from "./units";

export default function getPercentageFromVal(subject: RecipeInputIngredient, anchor: RecipeInputIngredient): number | undefined {
    const quantities: UnitVal[] = parseUnitValInputs(anchor.quantity, subject.quantity);
    if (quantities.length !== 2 || !isSameMeasure(quantities[0].unit, quantities[1].unit)) {
        return undefined;
    }

    const [anchorQuantity, subjectQuantity]: UnitVal[] = quantities;

    if (isConvertableUnit(subjectQuantity.unit)) {
        const subjectValNormalised: number = convert(subjectQuantity.value)
            .from(subjectQuantity.unit as Unit)
            .to(anchorQuantity.unit as Unit);
        return (subjectValNormalised / anchorQuantity.value) * 100;
    }
    else {
        return (subjectQuantity.value / anchorQuantity.value) * 100;
    }
};