import { Firestore } from "firebase/firestore";
import { createContext, PropsWithChildren, useContext } from "react";
import { AuthContext } from "../auth/AuthGate";
import Recipies from "../types/Recipes";
import { Recipe } from "../types/recipeTypes";
import useRecipeStorage from "../util/hooks/useRecipeStorage";

type RecipesContextType = {
    recipes: Recipies;
    addRecipe: (recipe: Recipe, onAvalible?: (id: string, recipe: Recipe) => void) => void;
    editRecipe: (editedRecipe: Recipe, id: string, onAvalible?: (id: string, recipe: Recipe) => void) => void;
    deleteRecipe: (id: string, onAvalible?: (id: string, recipe: Recipe) => void) => void;
};

export const RecipesContext = createContext<RecipesContextType>({} as RecipesContextType);

type Props = {
    db: Firestore;
}

export function RecipesContextProvider({db, children}: PropsWithChildren<Props>) {

    const user = useContext(AuthContext).user

    const recipeStorageInterface: RecipesContextType = useRecipeStorage(db, user);

    return (
        <RecipesContext.Provider value={recipeStorageInterface}>
            {children}
        </RecipesContext.Provider>
    );
}