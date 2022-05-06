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
 * @param input a string input
 * @returns the parsed input, or undefined if it cannot be parsed 
 */
export const parseUnitValInput = (input: string, ): UnitVal | undefined => {
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