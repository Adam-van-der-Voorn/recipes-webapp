import { Outlet } from "react-router-dom";
import AuthGate from "../auth/AuthGate";
import { RecipesContextProvider } from "../contexts/RecipesContext";
import setupFirebase from "../util/setupFirestore";

const { db, auth } = setupFirebase();

export default function Root() {
    return <AuthGate auth={auth} db={db}>
        <RecipesContextProvider db={db}>
            <Outlet />
        </RecipesContextProvider>
    </AuthGate>;
}