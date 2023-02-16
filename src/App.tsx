import { Outlet } from "react-router-dom";
import AuthGate from "./auth/AuthGate";
import { RecipesContextProvider } from "./contexts/RecipesContext";
import setupFirebase from "./util/setupFirestore";

const { db, auth } = setupFirebase();

function App() {
    return (
        <div id="app-content">
            <AuthGate auth={auth} db={db}>
                <RecipesContextProvider db={db}>
                    <Outlet />
                </RecipesContextProvider>
            </AuthGate>
        </div>
    );
}

export default App;
