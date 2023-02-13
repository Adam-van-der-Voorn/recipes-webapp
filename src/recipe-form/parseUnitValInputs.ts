import { UnitVal } from "../types/recipeTypes";
import { parseNumStrict } from "../util/numberInputs";

const unitValGroups = /^(?<value>\d+(\.\d+)?) *(?<unit>[aA-zZ ]*?) *$/;

/**
 * @param inputs an array of inputs to attempt to parse
 * @returns a parsed list of all the valid inputs
 */
export const parseUnitValInputs = (...inputs: string[]): Array<UnitVal | number> => {
    return inputs.flatMap(input => {
        const res = parseUnitValInput(input);
        if (res) {
            return [res];
        }
        else return [];
    });
};

/**
 * @param input a string input
 * @returns the parsed input, or undefined if it cannot be parsed 
 */
export const parseUnitValInput = (input: string): UnitVal | number | undefined => {
    const num = parseNumStrict(input);
    if (num) {
        return num;
    }

    const match: RegExpMatchArray | null = input.match(unitValGroups);
    if (match) {
        const { value, unit }: any = match.groups;
        return {
            value: parseFloat(value),
            unit: unit
        };
    }
    else return undefined;
};