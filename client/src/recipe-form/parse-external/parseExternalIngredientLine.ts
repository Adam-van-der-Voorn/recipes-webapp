import { ingredientUnits } from "./ingredientUnits";

// valid number is made up of [1-9]+(.[1-9]+)?
// or with fractions [1-9]* *<fraction>?

const fractions = ['½', '¼', '¾', '⅐', '⅑', '⅒', '⅓', '⅔', '⅕', '⅖', '⅗', '⅘', '⅙', '⅚', '⅛', '⅜', '⅝', '⅞'].join("|");
const numFractional = `(?<base>[1-9]*?) *(?<fraction>${fractions}|[1-9]+ ?/ ?[1-9]+)`;
const numFloat = `(?<float>[0-9]*\\.[0-9]+)`;
const numInt = `(?<int>[0-9]+)`;

const unit = ingredientUnits
    // sort with longest units first, so they get a chance to match
    // e.g. tbsp gets matched over tbs
    .toSorted((a, b) => b.length - a.length)
    .join("|");

// m = Multiline
// i = case-Insensitive
// u = Unicode
const modifiers = "mui";
const regex = [
    // fraction w unit
    new RegExp(`(${numFractional}) *(?<unit>${unit})?\\b`, modifiers),
    new RegExp(`(${numFloat}) *(?<unit>${unit})?\\b`, modifiers),
    new RegExp(`(${numInt}) *(?<unit>${unit})?\\b`, modifiers),
];

export function parseExternalIngredientLine(line: string) {
    // pre-process: remove any bullet points, trim
    line = line.replaceAll('•', '');
    line = line.replaceAll('▢', '');
    line = line.trim();

    if (line === '') {
        return null;
    }

    // console.log("for " + line);

    // find match
    let match = null;
    for (const re of regex) {
        match = line.match(re)
        // console.log("match:", match);
        if (match !== null) {
            break;
        }
    }
    if (match === null) {
        return { quantity: null, ingredient: line };
    }

    const quantityRaw = match[0];
    const ingredient = line
        .split(quantityRaw)
        .reduce((base, next) => base.trimEnd() + " " + next.trimStart(), "")
        .trim();
    // console.log("quantityRaw", quantityRaw);
    // console.log("ingredient", ingredient);

    const g = match.groups!;
    // console.log("groups", g);

    let quantity = "";
    if (g['fraction']) {
        if (g['base']) {
            quantity = `${g['base']} ${g['fraction']}`
        }
        else {
            quantity =  g['fraction']
        }
    }
    else if (g['float']) {
        quantity = `${g['float']}`;
    }
    else {
        quantity = g['int']
    }

    if (g['unit']) {
        quantity += ` ${g['unit']}`
    }
    // console.log("quantity", quantity);
    return { quantity, ingredient };
}