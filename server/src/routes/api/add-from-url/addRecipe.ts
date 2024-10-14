import { Firestore } from "firebase-admin/firestore";
import { v4 as uuid4 } from 'uuid';

export async function addNewRecipe(db: Firestore, userId: string, recipe: any) {
    try {
        const id: string = uuid4();
        const newRecipe = db.doc(`users/${userId}/recipies/${id}`);
        return newRecipe.create(recipe);
    } catch (error) {
        // TODO: bad user error?
        console.error('Error adding recipe: ', error);
        return null;
    }
};