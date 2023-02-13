import convert, { Unit } from "convert-units";
import { parseUnitValInputs } from "../recipe-form/parseUnitValInputs";
import { UnitVal } from "../types/recipeTypes";
import { IngredientInput } from "../types/RecipeInputTypes";
import { isSameMeasure, isConvertableUnit } from "./units";

export default function getPercentageFromVal(subject: IngredientInput, anchor: IngredientInput): number | undefined {
    const quantities: Array<number | UnitVal> = parseUnitValInputs(anchor.quantity, subject.quantity);
    if (quantities.length !== 2) {
        return undefined;
    }

    const [anchorQuantity, subjectQuantity] = quantities;
    const anchorIsNum = typeof anchorQuantity === 'number';
    const subjectIsNum = typeof subjectQuantity === 'number';
    if (anchorIsNum || subjectIsNum) {
        if (anchorIsNum && subjectIsNum) {
            return (subjectQuantity / anchorQuantity) * 100;
        }
        else return undefined;
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
    }
    else {
        return (subjectQuantity.value / anchorQuantity.value) * 100;
    }
};