
import { parse as parseHTML } from 'node-html-parser';
import { findNestedObjKey } from '../util/nestedObjKeys.js';
import { convertSchemaOrgRecipe, Recipe } from './convertSchemaOrgRecipe.js';

type ExtractRecipeRes = {
    error?: "unknown" | "schema.org.unsupported",
    recipe?: Recipe
}

export async function extractRecipe(url: URL): Promise<ExtractRecipeRes> {
    try {
        const response = await fetch(url);
        console.log("extract recipe:", url.hostname, "repsonded with", response.status);
        const body = await response.text();
        const html = parseHTML(body);
        const jsonLdList = html.querySelectorAll(`script[type="application/ld+json"]`);
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
        const recipes: Recipe[] = [];
        let i = 1;
        for (const el of jsonLdList) {
            const child = el.childNodes[0];
            if (!child) {
                console.log(`el ${i}:`, 'no child element');
                continue;
            }
            const text = child.innerText;
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
            const converted = convertSchemaOrgRecipe(schemaOrgRecipe as any);
            
            // temp solution - add og URL to notes
            let editedNotes = (converted.recipe.notes ?? "").trimEnd();
            if (editedNotes !== "") {
                editedNotes += "\n\n"
            }
            editedNotes += "original recipe: " + url.href
            converted.recipe.notes = editedNotes;
            //

            recipes.push(converted.recipe);
            if (converted.warnings.length > 0) {
                console.warn(`w! ${i}:`, 'conversion warnings for', url.href);
                converted.warnings.forEach(w => console.warn(`w! ${i}:`, w))
            }
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