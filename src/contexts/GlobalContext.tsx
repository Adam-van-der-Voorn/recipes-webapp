import { Firestore } from "firebase/firestore";
import { createContext, PropsWithChildren, useState } from "react";
import { Auth, onAuthStateChanged, User } from "firebase/auth";

export type RecipesContextType = {
    db: Firestore,
    auth: Auth,
    user: User | "pre-auth" | null,
};

export const GlobalContext = createContext<RecipesContextType>({} as RecipesContextType);

type Props = {
    db: Firestore,
    auth: Auth,
};

export function GlobalContextProvider({ db, auth, children }: PropsWithChildren<Props>) {

    const [user, setUser] = useState<User | "pre-auth" | null>("pre-auth");

    onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed. User:", user?.email);
        setUser(user);
    });
    
    return (
        <GlobalContext.Provider value={{ db, auth, user }}>
            {children}
        </GlobalContext.Provider>
    );
}