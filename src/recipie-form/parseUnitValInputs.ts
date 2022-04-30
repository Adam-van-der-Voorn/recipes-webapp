import { UnitVal } from "../types/recipieTypes";

const unitValGroups = /^(?<value>\d+(\.\d+)?) *(?<unit>[aA-zZ ]*?) *$/;

/**
 * @param inputs an array of inputs to attempt to parse
 * @returns a parsed list of all the valid inputs
 */
export const parseUnitValInputs = (...inputs: string[]): UnitVal[] => {
    return inputs.flatMap(input => {
        const match: RegExpMatchArray | null = input.match(unitValGroups);
        if (match) {
            const { value, unit }: any = match.groups;
            return [{
                value: parseFloat(value),
                unit: unit
            }];
        }
        else return [];
    });
};

/**
 * @param input a valid unitval input
 * @returns the parsed input
 */
export const parseUnitValInput = (input: string): UnitVal => {
    const match: RegExpMatchArray | null = input.match(unitValGroups);
    if (match) {
        const { value, unit }: any = match.groups;
        return {
            value: parseFloat(value),
            unit: unit
        };
    }
    else throw new Error("ParseUnitValInput: Valid input needs to be provided.")
};