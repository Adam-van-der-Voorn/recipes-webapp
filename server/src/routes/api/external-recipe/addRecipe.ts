import { Firestore } from "firebase-admin/firestore";

export function addNewRecipe(db: Firestore, userId: string, recipe: any) {
  try {
    const id: string = crypto.randomUUID();
    const newRecipe = db.doc(`users/${userId}/recipies/${id}`);
    return newRecipe.create(recipe);
  } catch (error) {
    // TODO: bad user error?
    console.error("Error adding recipe: ", error);
    return null;
  }
}
