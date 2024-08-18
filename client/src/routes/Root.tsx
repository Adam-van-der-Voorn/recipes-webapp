import { Outlet } from "react-router-dom";
import { GlobalContextProvider } from "../contexts/GlobalContext";
import setupFirebase from "../util/setupFirestore";

const { db, auth } = setupFirebase();

export default function Root() {
    return <GlobalContextProvider db={db} auth={auth}>
        <Outlet />
    </GlobalContextProvider>;
}