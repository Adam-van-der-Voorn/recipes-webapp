import { createContext, PropsWithChildren, useState } from "react";
import { Auth, onAuthStateChanged, User } from "firebase/auth";
import AuthForm from "./AuthForm";

type AuthContextType = {
    user: User;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type Props = {
    auth: Auth;
};

function AuthGate({ auth, children }: PropsWithChildren<Props>) {

    // non-null indicates user is signed in
    const [user, setUser] = useState<User | "pre-auth" | null>("pre-auth");

    onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed. User:", user?.email);
        setUser(user);
    });

    if (user === "pre-auth") {
        return null;
    }

    if (user) {
        return (
            <AuthContext.Provider value={{ user: user }}>
                {children}
            </AuthContext.Provider>
        );
    }
    else {
        return <AuthForm auth={auth} />;
    }
}

export default AuthGate;
