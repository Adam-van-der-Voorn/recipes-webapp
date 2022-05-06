import React, { createContext } from "react";
import { Outlet } from "react-router-dom";
import { Recipie } from "./types/recipieTypes";
import { deleteDoc, doc } from "firebase/firestore";
import useRecipieStorage from "./util/hooks/useRecipieStorage";
import setupFirebase from "./util/setupFirestore";

const { db } = setupFirebase()

type RecipiesContextType = {
    recipies: Map<string, Recipie>;
    addRecipie: (recipie: Recipie, onAvalible?: (id: string, recipie: Recipie) => void) => void;
    editRecipie: (editedRecipie: Recipie, id: string, onAvalible?: (id: string, recipie: Recipie) => void) => void;
    deleteRecipie: (id: string, onAvalible?: (id: string, recipie: Recipie) => void) => void;
};

export const RecipiesContext = createContext<RecipiesContextType>({} as RecipiesContextType);

function App() {

    const recipieStorageInterface: RecipiesContextType = useRecipieStorage(db); 

    return (
        <RecipiesContext.Provider value={recipieStorageInterface}>
            <div className="App">
                <Outlet />
            </div>
        </RecipiesContext.Provider>
    );
}

export default App;
