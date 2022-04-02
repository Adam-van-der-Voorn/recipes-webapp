import { UnitVal } from "../../types/recipieTypes";

const parseUnitValInput = (input: string): UnitVal => {
    const unitValGroups = /^(?<value>\d+(\.\d+)?) *(?<unit>[aA-zZ ]*?) *$/;
    const { value, unit }: any = input.match(unitValGroups)?.groups;
    return {
        value: parseFloat(value),
        unit: unit
    };
};

export default parseUnitValInput;