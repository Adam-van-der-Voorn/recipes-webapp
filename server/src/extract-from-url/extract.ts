import { app } from "firebase-admin";

export async function extract(recipeUrl: string, app: app.App) {
    console.log("recipe url:", recipeUrl);
    
    // stub impl just to hit firestore in some way
    return (await app.firestore().listCollections())
        .map(x => x.id);
}
