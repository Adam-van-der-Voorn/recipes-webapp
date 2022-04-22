import React, { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { Recipie, dummyData } from "./types/recipieTypes";

type RecipiesContextType = {
    recipies: Recipie[];
    setRecipies: (recipies: Recipie[]) => void;
    addRecipie: (recipie: Recipie) => void;
    editRecipie: (editedRecipie: Recipie, originalName?: string) => void;
};

export const RecipiesContext = createContext<RecipiesContextType>({} as RecipiesContextType);

function App() {

    const [recipies, setRecipies] = useState<Recipie[]>(dummyData);

    const addRecipie = (recipie: Recipie) => {
        setRecipies(old => [...old, recipie]);
    };

    const editRecipie = (editedRecipie: Recipie, originalName?: string) => {
        if (originalName === undefined) {
            originalName = editedRecipie.name;
        }
        const without = recipies.filter(r => r.name !== originalName);
        setRecipies([...without, editedRecipie]);
    };


    return (
        <RecipiesContext.Provider value={{
            "recipies": recipies,
            "setRecipies": setRecipies,
            "addRecipie": addRecipie,
            "editRecipie": editRecipie,
        }}>
            <div className="App">
                <Outlet />
            </div>
        </RecipiesContext.Provider>
    );
}

export default App;
