import { PropsWithChildren, useContext } from "react";
import AuthForm from "./AuthForm";
import { GlobalContext } from "../contexts/GlobalContext";

type Props = {};

function AuthGate({ children }: PropsWithChildren<Props>) {
    const { auth, user } = useContext(GlobalContext);

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
