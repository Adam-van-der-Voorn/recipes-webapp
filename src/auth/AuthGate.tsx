import { PropsWithChildren, useContext } from "react";
import AuthForm from "./AuthForm";
import { GlobalContext } from "../contexts/GlobalContext";
import Loading from "../general/placeholders/Loading";

type Props = {};

function AuthGate({ children }: PropsWithChildren<Props>) {
    const { auth, user } = useContext(GlobalContext);

    if (user === "pre-auth") {
        return <Loading message="Finding user ..." />;;
    }
    else if (user) {
        return <>{children}</>
    }
    else {
        return <AuthForm auth={auth} />;
    }
}

export default AuthGate;
