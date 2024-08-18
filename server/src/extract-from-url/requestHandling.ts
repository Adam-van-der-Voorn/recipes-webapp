import { app } from "firebase-admin";
import { ResponseData } from "../requestHandling.js";
import { extract } from "./extract.js";

export async function getResponseData(app: app.App, method: string, url: URL): Promise<ResponseData> {
    if (method !== "GET") {
        return {
            body: { errors: ["invalid request - this resource accepts only GETs"] },
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

    return {
        body: { IDs: result },
        statusCode: 200
    };
}