import { IngredientQuantity, UnitVal } from "../types/recipeTypes.ts";
import { parseNumStrict } from "../util/numberInputs.ts";

const unitValGroups = /^(?<value>\d+(\.\d+)?) *(?<unit>[aA-zZ ]*?) *$/;

/**
 * @param input a string input
 * @returns the parsed input, or undefined if it cannot be parsed 
 */
export const parseIngredientQuantity = (input: string): IngredientQuantity => {
    const num = parseNumStrict(input);
    if (num) {
        return num;
    }
 
    const unitval = parseUnitVal(input);
    if (unitval) {
        return unitval;
    }

    return input;
};

/**
 * @param input a string input
 * @returns the parsed input, or undefined if it cannot be parsed 
 */
export const parseUnitVal = (input: string): UnitVal | undefined => {
    const match: RegExpMatchArray | null = input.match(unitValGroups);
    if (match) {
        const { value, unit }: any = match.groups;
        if (unit.trim() === '') {
            return undefined;
        }
        const valueNum = parseFloat(value);
        if (isNaN(valueNum)) {
            return undefined;
        }
        return {
            value: parseFloat(value),
            unit: unit
        };
    }
    else return undefined;
};