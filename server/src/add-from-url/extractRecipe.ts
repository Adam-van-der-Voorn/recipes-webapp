
import { parseHtmlAsync } from 'libxmljs';
import { findNestedObjKey } from '../util/nestedObjKeys.js';

// temp, replace with real type once we have shared fe/be types
type Recipe = {
    name: string
}

type ExtractRecipeRes = {
    error?: "unknown" | "schema.org.unsupported",
    recipe?: Recipe
}

export async function extractRecipe(url: URL): Promise<ExtractRecipeRes> {
    try {
        const response = await fetch(url);
        console.log("extract recipe:", url.hostname, "repsonded with", response.status);
        const body = await response.text();
        const html = await parseHtmlAsync(body);
        const jsonLdList = html.find("//script[@type='application/ld+json']");
        if (jsonLdList.length === 0) {
            const regex = /"@type": *"Recipe"/;
            const exists = regex.test(body);
            if (exists) {
                console.warn("extract recipe: no schema.org elements found by xml parser, but evidence of recipe schema found in body via grepping");
            }
            else {
                console.log("extract recipe: no schema.org elements found");
            }
            return { error: 'schema.org.unsupported' }
        }

        console.log("extract recipe:", jsonLdList.length, "schema.org elements found");
        const recipes = [];
        let i = 1;
        for (const el of jsonLdList) {
            const child = el.child(0);
            if (!child) {
                console.log(`el ${i}:`, 'no child element');
                continue;
            }
            const text = child.text();
            let json;
            try {
                json = JSON.parse(text);
            }
            catch (e) {
                console.log(`el ${i}:`, 'child element is not json');
                continue;
            }
            const schemaOrgRecipe = findNestedObjKey(json, o => o['@type'] === 'Recipe');
            if (!schemaOrgRecipe) {
                console.log(`el ${i}:`, 'json child has no recipe');
                continue;
            }
            console.log(`el ${i}:`, 'valid recipe');
            const recipe = convertSchemaOrgRecipe(schemaOrgRecipe as any);
            recipes.push(recipe);
            i ++
        }

        if (recipes.length === 0) {
            console.log("no recipes found")
            return { error: 'schema.org.unsupported' }
        }

        if (recipes.length > 1) {
            console.log(recipes.length, "recipes found, returning first")
        }

        return { recipe: recipes[0] }
    }
    catch (e) {
        console.error("extractRecipe: failure", e);
        return { error: "unknown" };
    }
}

type SchemaOrgRecipe = {
    '@type': 'Recipe',
    name: string,
    description: string,
    image: string[], // links, origonal first and then resizes in decreasing order
    // multiple options, e.g. ['9', '9 - 10 fritters']
    // TODO: can also be a https://schema.org/QuantitativeValue
    recipeYield: string[], 
    // ISO 8601 duration format
    // https://www.digi.com/resources/documentation/digidocs/90001488-13/reference/r_iso_8601_duration_format.htm
    totalTime: string,
    recipeIngredient: string[]
    // too complicated for now
    // recipeInstructions: ...
};

function convertSchemaOrgRecipe(input: SchemaOrgRecipe): Recipe {
    return {
        name: input.name
    }
}