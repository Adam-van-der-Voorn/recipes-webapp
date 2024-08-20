import { Firestore } from "firebase-admin/firestore";
import { addNewRecipe } from "./addRecipe.js";
import { Request, Response } from 'express';
import { MESSAGE_UNKNOWN_UNEXPECTED_ERROR } from "../routes.js";

const MESSAGE_BAD_URL = "Invalid request. The request body must be a JSON object with a 'url' property. The value of 'url' must be a valid URL."

export async function addRecipeFromUrl(req: Request, res: Response, db: Firestore) {
    console.log("req", req.body)
    const recipeUrlParam = req.body['url'];
    let recipeUrl;
    try {
        console.log("recipe url:", recipeUrlParam);
        recipeUrl = new URL(recipeUrlParam);
    }
    catch (e: any) {
        if (e?.code === 'ERR_INVALID_URL') {
            res.status(400)
                .json({ error: MESSAGE_BAD_URL });
        }
        else {
            console.error(e);
            res.status(500)
                .json({ error: MESSAGE_UNKNOWN_UNEXPECTED_ERROR });
        }""
        return;
    }
    // user ID is test user- TODO: test is user needs to be verified
    const result = await addNewRecipe(db, "1hUzwovTtpXV2Ix3cA8ej1DKtud2", {
        // just add any ol recipe for now
        name: "FROM ADMIN SDK @ " + new Date()
    });
    if (result !== null) {
        res.status(200)
            .json({});
    }
    else {
        res.status(500)
            .json({ error: MESSAGE_UNKNOWN_UNEXPECTED_ERROR });
    }
}; 