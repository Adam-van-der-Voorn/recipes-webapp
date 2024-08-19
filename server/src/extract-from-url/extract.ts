import { app } from "firebase-admin";
import { Firestore } from "firebase-admin/firestore";
import { v4 as uuid4 } from 'uuid';

export async function extract(recipeUrl: string, app: app.App): Promise<boolean> {
    console.log("recipe url:", recipeUrl);
    const res = await addNewRecipe(app.firestore(), "1hUzwovTtpXV2Ix3cA8ej1DKtud2", {
        name: "FROM ADMIN SDK @ " + new Date()
    })
    return res ? true : false
}

const addNewRecipe = async (db: Firestore, userId: string, recipe: any) => {
    try {
        const id: string = uuid4();
        const newRecipe = db.doc(`users/${userId}/recipies/${id}`);
        return newRecipe.create(recipe);
    } catch (error) {
        console.error('Error adding recipe: ', error);
        return null;
    }
};