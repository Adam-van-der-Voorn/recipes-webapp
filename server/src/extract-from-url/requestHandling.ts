import { ResponseData } from "../requestHandling.js";

export function getResponseData(method: string, url: URL): ResponseData {
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
    console.log("recipe url:", recipeUrl);

    return {
        body: { errors: ["todo - not implemented"] },
        statusCode: 200
    };
}