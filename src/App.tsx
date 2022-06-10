import React, { createContext } from "react";
import { Outlet } from "react-router-dom";
import { Recipe } from "./types/recipeTypes";
import useRecipeStorage from "./util/hooks/useRecipeStorage";
import setupFirebase from "./util/setupFirestore";

const { db } = setupFirebase();

type RecipesContextType = {
    recipes: Map<string, Recipe>;
    addRecipe: (recipe: Recipe, onAvalible?: (id: string, recipe: Recipe) => void) => void;
    editRecipe: (editedRecipe: Recipe, id: string, onAvalible?: (id: string, recipe: Recipe) => void) => void;
    deleteRecipe: (id: string, onAvalible?: (id: string, recipe: Recipe) => void) => void;
};

export const RecipesContext = createContext<RecipesContextType>({} as RecipesContextType);

function App() {

    const recipeStorageInterface: RecipesContextType = useRecipeStorage(db);

    return (
        <RecipesContext.Provider value={recipeStorageInterface}>
            <div className="App">
                <Outlet />
            </div>
        </RecipesContext.Provider>
    );
}

export default App;
