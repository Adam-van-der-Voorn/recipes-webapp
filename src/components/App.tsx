import React, { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { dummyData, Recipie } from "../types/recipieTypes";

type RecipiesContextType = {
  recipies: Recipie[];
  setRecipies: (recipies: Recipie[]) => void;
}

export const RecipiesContext = createContext<RecipiesContextType>({} as RecipiesContextType)

function App() {

  const [recipies, setRecipies] = useState<Recipie[]>(dummyData);

  return (
    <RecipiesContext.Provider value={{
      "recipies": recipies,
      "setRecipies": setRecipies
    }}>
      <div className="App">
        <Outlet />
      </div>
    </RecipiesContext.Provider>
  );
}

export default App;
