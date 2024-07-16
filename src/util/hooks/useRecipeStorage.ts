import { setDoc, doc, onSnapshot, collection, Firestore, deleteDoc } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { Recipe } from "../../types/recipeTypes";
import { v4 as uuid4 } from 'uuid';
import Recipies from "../../types/Recipes";

export type RecipesStorageInterface = {
    recipes: Recipies;
    addRecipe: (recipe: Recipe, onAvalible?: (id: string, recipe: Recipe) => void) => void;
    editRecipe: (editedRecipe: Recipe, id: string, onAvalible?: (id: string, recipe: Recipe) => void) => void;
    deleteRecipe: (id: string, onAvalible?: (id: string, recipe: Recipe) => void) => void;
};

export default function useRecipeStorage(db: Firestore, userId: string | null) {
    const [recipes, setRecipes] = useState<Recipies>({ status: "prefetch" });
    const pendingWrites = useRef(new Map<string, (id: string, recipe: Recipe) => void>());

    const addRecipe = (recipe: Recipe, onAvalible?: (id: string, recipe: Recipe) => void) => {
        if (!userId) {
            console.warn("attempt to add recipe with non-authed user")
            return;
        }
        const id: string = uuid4();
        if (onAvalible) {
            pendingWrites.current.set(id + '-added', onAvalible)
        }
        return setDoc(doc(db, `users/${userId}/recipies/${id}`), recipe)
            .then(() => {
                console.log("Recipe written to server with ID", id);
            })
    };

    const editRecipe = (editedRecipe: Recipe, id: string, onAvalible?: (id: string, recipe: Recipe) => void) => {
        if (!userId) {
            console.warn("attempt to edit recipe with non-authed user")
            return;
        }
        if (onAvalible) {
            pendingWrites.current.set(id + '-modified', onAvalible)
        }
        return setDoc(doc(db, `users/${userId}/recipies/${id}`), editedRecipe)
            .then(() => {
                console.log('Recipe edited on server with ID', id);
            })
    };

    const deleteRecipe = (id: string, onAvalible?: (id: string, recipe: Recipe) => void) => {
        if (!userId) {
            console.warn("attempt to delete recipe with non-authed user")
            return;
        }
        if (onAvalible) {
            pendingWrites.current.set(id + '-removed', onAvalible)
        }
        return deleteDoc(doc(db, `users/${userId}/recipies/${id}`))
            .then(() => {
                console.log('Recipe deleted on server with ID', id);
            })
    };
    
    // for the dep array- we want to re-sub when the user id changes 
    useEffect(() => {
        if (!userId) {
            return;
        }
        const unsubscribe = onSnapshot(collection(db, `users/${userId}/recipies`), { includeMetadataChanges: true },
            (querySnapshot) => {
                // extract recipes
                const recipes: Map<string, Recipe> = new Map(querySnapshot.docs.map(doc => {
                    const recipe = doc.data() as Recipe;
                    console.assert(recipe.name !== undefined, `Recipe ${doc.id} pulled from DB has no name field`);
                    return [doc.id, recipe];
                }));

                // extract change data
                const changeData = querySnapshot.docChanges().map(change => {
                    const doc = change.doc;
                    return {type: change.type, data: doc.data(), id: doc.id}
                })

                // confirm data has been written
                changeData.forEach(change => {
                    const writeCallback = pendingWrites.current.get(change.id + '-' + change.type);
                    if (writeCallback) {
                        console.log("Callback on", change)
                        writeCallback(change.id, change.data as Recipe);
                    }
                });
                
                const source = querySnapshot.metadata.fromCache ? "local cache" : "server";
                console.log(`Recipes snapshot (from ${source}):`, { recipes: recipes, changes: changeData});
                setRecipes({
                    status: "ok",
                    data: recipes,
                });
            },
            (error) => {
                setRecipes({
                    status: "error",
                    message: "Could not get your recipes"
                })
                console.error("Recipes snapshot failed:", error);
            });
        console.log('Subscribed to recipe snapshots');
        return function cleanup() {
            console.log('Unsubscribed from recipe snapshots');
            unsubscribe();
        };
    }, [db, userId]);

    return {
        "recipes": recipes,
        "addRecipe": addRecipe,
        "editRecipe": editRecipe,
        "deleteRecipe": deleteRecipe
    }
}