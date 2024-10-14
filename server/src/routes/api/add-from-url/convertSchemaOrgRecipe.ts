
import { HowToStep, Recipe as SchemaOrgRecipe } from 'schema-dts'
import { parse as parseIso8601Duration } from 'iso8601-duration'
import { parseExternalIngredientLine } from '../../../parse-external/parseExternalIngredientLine.ts';
import he from 'he'

// for now, copy pasted from client/src/types/recipeTypes.ts
// make shared type later

const LOG_PREFIX = "convert-schema-org-recipe: "

type UnitVal = {
    value: number;
    unit: string;
};

type IngredientQuantity = UnitVal | number | string

type Ingredient = {
    name: string;
    quantity: IngredientQuantity;
    optional: boolean;
    kjs?: number;
};

type IngredientsSubList = {
    name: string,
    ingredients: Ingredient[],
};

export type Recipe = {
    name: string;
    timeframe?: string;
    servings?: string; // (in ui: serves)
    makes?: string; // (in ui: yields)
    notes?: string;
    ingredients?: {
        lists: IngredientsSubList[];
        anchor?: number;
    };
    instructions?: string;
};

export function convertSchemaOrgRecipe(input: SchemaOrgRecipe): { recipe: Recipe, warnings: string[] } {
    const warnings: string[] = [];
    // start with name, as it is required
    let name: string;
    if (input.name !== undefined) {
        name = input.name.toString();
    }
    else {
        if (input.alternateName !== undefined) {
            name = input.alternateName.toString();
        }
        else {
            warnings.push("name not found")
            name = ""
        }
    }
    name = he.decode(name)
    const result: Recipe = { name }

    // total cook time (could also fall back to adding up all other times)
    if (input.totalTime) {
        const totalTimeRaw = input.totalTime.toString();
        const durationText = convertIso8601Duration(totalTimeRaw);
        if (durationText) {
            result.timeframe = durationText;
        }
    }

    // recipe yield
    const yieldRes = convertYield(input);
    if (yieldRes.result) {
        result.makes = yieldRes.result;
    }
    if (yieldRes.warning) {
        warnings.push(yieldRes.warning)
    }

    // description -> notes
    if (input.description) {
        const descriptionRaw = input.description.toString();
        result.notes = he.decode(descriptionRaw)
    }

    // ingredients
    if (input.recipeIngredient || input.ingredients) {
        // perfer non-deprectaed recipeIngredient
        const ingredientsRaw = input.recipeIngredient
            ? input.recipeIngredient
            : input.ingredients
        const conversion = convertIngredients(ingredientsRaw);
        if (conversion.result) {
            result.ingredients = conversion.result;
        }
        warnings.push(...conversion.warnings)
    }

    // instructions
    if (input.recipeInstructions) {
        const conversion = convertInstructions(input.recipeInstructions);
        if (conversion.result) {
            result.instructions = conversion.result;
        }
        warnings.push(...conversion.warnings)
    }

    return { recipe: result, warnings }
}

function convertInstructions(instructionsRaw: SchemaOrgRecipe['recipeInstructions']): { result: string, warnings: string[] } {
    const warnSet = new Set<string>();
    if (!Array.isArray(instructionsRaw)) {
        // @ts-ignore - it's not an array, so make it one. trust me
        instructionsRaw = [instructionsRaw]
    }
    
    let instructions = [];
    for (const el of instructionsRaw as unknown[]) {
        const ela = el as any;
        if (typeof el === 'string') {
            instructions.push(el)
        }
        else if (ela['@type'] === 'HowToStep') {
            instructions.push((el as HowToStep).text)
        }
        else {
            warnSet.add("instruction is an unknown type")
        }
    }

    const result = he.decode(instructions.join("\n"))
    const warnings = Array.from(warnSet.values());
    return { result, warnings }    
}

type SchemaOrgIngredient = SchemaOrgRecipe['ingredients'] | SchemaOrgRecipe['recipeIngredient'];
function convertIngredients(ingredientsRaw: SchemaOrgIngredient): { result?: Recipe['ingredients'], warnings: string[] } {
    const warnSet = new Set<string>();
    let rawIngredientList: unknown[];
    if (typeof ingredientsRaw === 'string') {
        // odd, but technically possible in spec
        rawIngredientList = [ingredientsRaw]
    }
    else {
        rawIngredientList = ingredientsRaw as unknown[];
    }

    const ingredients = []
    for (const s of rawIngredientList) {
        if (typeof s !== 'string') {
            warnSet.add("ingredient in list is not string")
            continue;
        }
        const decoded = he.decode(s);
        const parsed = parseExternalIngredientLine(decoded)
        if (parsed == null) {
            continue;
        }
        ingredients.push({
            name: parsed.ingredient,
            quantity: parsed?.quantity ?? "",
            optional: false
        })
    }
    
    const warnings = Array.from(warnSet.values());
    if (ingredients.length > 0) {
        const recipieIngredients = { lists: [{ name: "Main", ingredients }] };
        return { result: recipieIngredients, warnings };
    }
    else {
        return { warnings }
    }
}

function convertYield(input: SchemaOrgRecipe): { result?: string, warning?: string } {
    if (!input.recipeYield && !input.yield) {
        return {}
    }
    const yieldRaw = input.recipeYield
        ? input.recipeYield
        : input.yield;
    if (typeof yieldRaw === 'string') {
        return { result: he.decode(yieldRaw)};
    }
    if (Array.isArray(yieldRaw)) {
        if (typeof yieldRaw[0] === 'string') {
            return { result: he.decode(yieldRaw[0]) };
        }            
    }
    return { warning: "yield is in an unknown format" } 
}

function convertIso8601Duration(iso8601Duration: string): string | null {
    try {
        const d = parseIso8601Duration(iso8601Duration);
        let minutes = 0;
        if (d.seconds) {
            minutes += d.seconds / 60;
        }
        if (d.minutes) {
            minutes += d.minutes;
        }
        if (d.hours) {
            minutes += d.hours * 60; 
        }
        if (d.days) {
            minutes += d.days * 60 * 24; 
        }
        if (d.weeks) {
            minutes += d.weeks * 60 * 24 * 7; 
        }
        
        // duration localisation??
        return minutes + " minutes"
    }
    catch (e) {
        console.warn(LOG_PREFIX, `failed to parse ISO8601 duration ${iso8601Duration}`, e)
        return null;
    }
}