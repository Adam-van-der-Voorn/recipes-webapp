import { parseExternalIngredientLine } from "./parseExternalIngredientLine.js";

export function parseExternalIngredientText(externalText: string) {
    return externalText
        .split("\n")
        .map(line => parseExternalIngredientLine(line))
        .filter(p => p !== null);
};