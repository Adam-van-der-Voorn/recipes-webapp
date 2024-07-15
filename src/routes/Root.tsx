import { Outlet } from "react-router-dom";
import AuthGate from "../auth/AuthGate";
import { RecipesContextProvider } from "../contexts/RecipesContext";
import setupFirebase from "../util/setupFirestore";
import LoginForm from "../auth/LoginForm";
import AuthForm from "../auth/AuthForm";

const { db, auth } = setupFirebase();

export default function Root() {
    return <AuthGate auth={auth}>
        <RecipesContextProvider db={db}>
            <Outlet />
        </RecipesContextProvider>
    </AuthGate>;
}