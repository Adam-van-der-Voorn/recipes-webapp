import { PropsWithChildren } from "react";
import { Auth, User } from "firebase/auth";
import AuthForm from "./AuthForm";

type Props = {
    auth: Auth;
    user: "pre-auth" | User | null
};

function AuthGate({ user, auth, children }: PropsWithChildren<Props>) {
    if (user === "pre-auth") {
        return null;
    }
    else if (user) {
        return <>{children}</>
    }
    else {
        return <AuthForm auth={auth} />;
    }
}

export default AuthGate;
