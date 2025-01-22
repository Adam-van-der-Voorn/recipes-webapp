// deno-lint-ignore-file no-explicit-any
import { Request, Response } from 'express';
import { invalidUrl, unknownUnexpected } from "../../../../applicationErrorCodes.ts";
import { parse as parseHTML } from 'node-html-parser';

const MESSAGE_BAD_URL = "Invalid request. The request must include a 'url' query parameter. The value of 'url' must be a valid URL.";

export async function getSchemaOrgDump(req: Request, res: Response) {
    // string | string[] | undefined
    let recipeUrlParam: any = req.query['url']
    if (Array.isArray(recipeUrlParam)) {
        recipeUrlParam = recipeUrlParam[0];
    }
    console.log("url parms", req.query)
    let recipeUrl;
    try {
        console.log("recipe url:", recipeUrlParam);
        recipeUrl = new URL(recipeUrlParam);
    }
    catch (e: unknown) {
        if (e instanceof TypeError) {
            console.log('bad recipe url');
            res.status(400)
                .json({ ecode: invalidUrl, context: MESSAGE_BAD_URL });
        }
        else {
            console.error('unexpected error', e);
            res.status(500)
                .json({ ecode: unknownUnexpected });
        }
        return;
    }
    
    const r = await extractSchemaOrg(recipeUrl);

    res.status(200)
        .json({ results: r });
}; 

export async function extractSchemaOrg(url: URL): Promise<any[]> {
    try {
        const response = await fetch(url);
        console.log("extractJsonSchema recipe:", url.hostname, "repsonded with", response.status);
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
            return []
        }

        console.log("extract recipe:", jsonLdList.length, "schema.org elements found");
        const jsonLdListAsJson: any[] = [];
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
            catch (_e) {
                console.log(`el ${i}:`, 'child element is not json');
                continue;
            }
            console.log(`el ${i}:`, 'valid json');
            jsonLdListAsJson.push(json)
            i ++
        }
        return jsonLdListAsJson;
    }
    catch (e) {
        console.error("extractRecipe: failure", e);
        return [];
    }
}