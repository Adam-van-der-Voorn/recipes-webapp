import { app } from "firebase-admin";
import { ResponseData } from "../requestHandling.js";
import { extract } from "./extract.js";

export async function getResponseData(app: app.App, method: string, url: URL): Promise<ResponseData> {
    if (method !== "POST") {
        return {
            body: { errors: ["invalid request - this resource accepts only POSTs"] },
            statusCode: 400
        };
    }

    const recipeUrl = url.searchParams.get('url');
    if (!recipeUrl) {
        return {
            body: { errors: ["invalid request - url parameter required"] },
            statusCode: 400
        };
    }

    const result = await extract(recipeUrl, app);

    if (result) {
        return {
            statusCode: 200,
            body: {}
        };
    }
    else {
        return {
            body: { errors: [ "unexpected error" ] },
            statusCode: 500
        };
    }
}