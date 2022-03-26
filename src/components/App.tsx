import React, { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { dummyData, Recipie } from "../types/recipieTypes";

type RecipiesContextType = {
  recipies: Recipie[];
  setRecipies: (recipies: Recipie[]) => void;
  addRecipie: (recipie: Recipie) => void;
}

export const RecipiesContext = createContext<RecipiesContextType>({} as RecipiesContextType)

function App() {

  const [recipies, setRecipies] = useState<Recipie[]>(dummyData);
  
  const addRecipie = (recipie: Recipie) => {
      setRecipies(old => [...old, recipie])
  }

  return (
    <RecipiesContext.Provider value={{
      "recipies": recipies,
      "setRecipies": setRecipies,
      "addRecipie": addRecipie
    }}>
      <div className="App">
        <Outlet />
      </div>
    </RecipiesContext.Provider>
  );
}

export default App;
