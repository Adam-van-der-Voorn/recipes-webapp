import { Firestore } from "firebase/firestore";
import { createContext, PropsWithChildren, useState } from "react";
import { Auth, onAuthStateChanged, User } from "firebase/auth";
import useRecipeStorage, { RecipesStorageInterface } from "../util/hooks/useRecipeStorage";
import { UserState } from "../types/user";

export type RecipesContextType = {
    db: Firestore,
    auth: Auth,
    user: UserState,
} & RecipesStorageInterface;

export const GlobalContext = createContext<RecipesContextType>({} as RecipesContextType);

type Props = {
    db: Firestore,
    auth: Auth,
};

export function GlobalContextProvider({ db, auth, children }: PropsWithChildren<Props>) {

    const [user, setUser] = useState<UserState>("pre-auth");
    const recipeStorageInterface = useRecipeStorage(db, (user as User)?.uid ?? null);
    
    onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed. User:", user?.email);
        setUser(user);
    });
    
    return (
        <GlobalContext.Provider value={{ db, auth, user, ...recipeStorageInterface }}>
            {children}
        </GlobalContext.Provider>
    );
}