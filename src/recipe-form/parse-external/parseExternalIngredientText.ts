import { parseExternalIngredientLine } from "./parseExternalIngredientLine";

export function parseExternalIngredientText(externalText: string) {
    return externalText
        .split("\n")
        .map(line => parseExternalIngredientLine(line))
        .filter(p => p !== null);
};