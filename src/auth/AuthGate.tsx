import { createContext, PropsWithChildren, useState } from "react";
import { Auth, onAuthStateChanged, User } from "firebase/auth";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { Firestore } from "firebase/firestore";
import Loading from "../general/placeholders/Loading";

type AuthContextType = {
    user: User;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type Props = {
    auth: Auth;
    db: Firestore
};

function AuthGate({ auth, db, children }: PropsWithChildren<Props>) {

    // non-null indicates user is signed in
    const [user, setUser] = useState<User | "pre-auth" | null>("pre-auth");

    // determines if an unauthenticated user should see a login or sign up screen
    const [isLogin, setIsLogin] = useState(true);

    onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed. User:", user?.email);
        setUser(user);
    });

    if (user === "pre-auth") {
        return <Loading message="Trying to log you in..." />
    }

    if (user) {
        return (
            <AuthContext.Provider value={{ user: user }}>
                {children}
            </AuthContext.Provider>
        );
    }

    if (isLogin) {
        return <>
            <LoginForm auth={auth} />
            <button onClick={() => setIsLogin(false)}>Sign up</button>
        </>;
    }
    else {
        return <>
            <SignUpForm auth={auth} />
            <button onClick={() => setIsLogin(true)}>Log in</button>
        </>;
    }
}

export default AuthGate;
