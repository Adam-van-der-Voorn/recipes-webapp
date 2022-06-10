import { setDoc, doc, onSnapshot, collection, Firestore, deleteDoc } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { Recipe } from "../../types/recipeTypes";
import { v4 as uuid4 } from 'uuid';

export default function useRecipeStorage(db: Firestore) {
    const [recipes, setRecipes] = useState<Map<string, Recipe>>(new Map());
    const pendingWrites = useRef(new Map<string, (id: string, recipe: Recipe) => void>());

    const addRecipe = (recipe: Recipe, onAvalible?: (id: string, recipe: Recipe) => void) => {
        const id: string = uuid4();
        if (onAvalible) {
            pendingWrites.current.set(id + '-added', onAvalible)
        }
        return setDoc(doc(db, `recipies/${id}`), recipe)
            .then(() => {
                console.log("Recipe written to server with ID", id);
            })
    };

    const editRecipe = (editedRecipe: Recipe, id: string, onAvalible?: (id: string, recipe: Recipe) => void) => {
        if (onAvalible) {
            pendingWrites.current.set(id + '-modified', onAvalible)
        }
        return setDoc(doc(db, `recipies/${id}`), editedRecipe)
            .then(() => {
                console.log('Recipe edited on server with ID', id);
            })
    };

    const deleteRecipe = (id: string, onAvalible?: (id: string, recipe: Recipe) => void) => {
        if (onAvalible) {
            pendingWrites.current.set(id + '-removed', onAvalible)
        }
        return deleteDoc(doc(db, `recipies/${id}`))
            .then(() => {
                console.log('Recipe deleted on server with ID', id);
            })
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'recipies'), { includeMetadataChanges: true },
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
                setRecipes(recipes);
            },
            (error) => {
                console.error("Recipes snapshot failed:", error);
            });
        console.log('Subscribed to recipe snapshots');
        return function cleanup() {
            console.log('Unsubscribed from recipe snapshots');
            unsubscribe();
        };
    }, [db]);

    return {
        "recipes": recipes,
        "addRecipe": addRecipe,
        "editRecipe": editRecipe,
        "deleteRecipe": deleteRecipe
    }
}