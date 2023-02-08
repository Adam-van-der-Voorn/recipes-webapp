import convert, { Unit } from "convert-units";
import { parseUnitValInputs } from "../recipe-form/parseUnitValInputs";
import { UnitVal } from "../types/recipeTypes";
import { IngredientInput } from "../types/RecipeInputTypes";
import { isSameMeasure, isConvertableUnit } from "./units";

export default function getPercentageFromVal(subject: IngredientInput, anchor: IngredientInput): number | undefined {
    const quantities: UnitVal[] = parseUnitValInputs(anchor.quantity, subject.quantity);

    // check quantities can be parsed,
    // and that quanities can be converted between
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