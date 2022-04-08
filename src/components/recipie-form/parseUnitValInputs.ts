import { UnitVal } from "../../types/recipieTypes";

const parseUnitValInputs = (...inputs: string[]): UnitVal[] => {
    const unitValGroups = /^(?<value>\d+(\.\d+)?) *(?<unit>[aA-zZ ]*?) *$/;
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

export default parseUnitValInputs;