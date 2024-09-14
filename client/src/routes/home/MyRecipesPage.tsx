import { Link, useNavigate } from "react-router-dom";
import MyRecipesPageContent from "./MyRecipesPageContent";
import { useWindowDimensions } from "../../util/hooks/useWindowDimensions";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import AuthGate from "../../auth/AuthGate";
import { GlobalContext } from "../../contexts/GlobalContext";
import { User } from "firebase/auth";

const minSearchbarSizePx = 30;

function MyRecipesPage() {
    const { windowWidth } = useWindowDimensions();
    const searchBarRef = useRef<HTMLInputElement>(null);
    const [displayTitle, setDisplayTitle] = useState(false);
    const [dialogueOpen, setDialogueOpen] = useState(false);

    useLayoutEffect(() => {
        const threshold = 500;
        if (!displayTitle && windowWidth > threshold) {
            setDisplayTitle(true);
        }
        if (displayTitle && windowWidth < threshold) {
            setDisplayTitle(false);
        }
    }, [windowWidth, displayTitle]);

    const gridTemplateColumns = displayTitle
        ? `1fr minmax(${minSearchbarSizePx}px, 300px) auto`
        : `minmax(${minSearchbarSizePx}px, 1fr) auto`;

    const headerStyle: React.CSSProperties = {
        gridTemplateColumns
    };

    return <div className="page">
        <header style={headerStyle}>
            {displayTitle
                ? <h1 className="headerTitle" style={{ whiteSpace: "nowrap" }}>My Recipes</h1>
                : null
            }
            <input ref={searchBarRef} className="headerTextInput searchTextInput" type="text" />
            <button className="headerButton"
                onClick={() => setDialogueOpen(true)}
            >Add Recipe
            </button>
        </header>
        <Dialogue open={dialogueOpen} />
        <AuthGate>
            <MyRecipesPageContent />
        </AuthGate>
    </div>;
}

type DialogProps = {
    open: boolean;
};

function Dialogue({ open }: DialogProps) {
    const { user } = useContext(GlobalContext);

    const doStuff = (fbUser: User, url: string) => {
        fbUser.getIdToken(/* forceRefresh */ true)
            .then((idToken) => {
                const body = JSON.stringify({ url });
                fetch("/api/add-from-url", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `JWT ${idToken}`
                    },
                    body
                });
            })
            .catch((error) => {
                console.error(error);
                alert(error.toString());
            });
    };

    let content;
    if (user === "pre-auth" || user === null) {
        content = "no user";
    }
    else {
        content = <>
            <Link to="/add-recipe">manual add</Link>
            <form onSubmit={(ev) => {
                ev.preventDefault()
                const value = (ev.target as any)
                    .querySelector("#add-from-url")
                    .value
                doStuff(user, value)
            }}>
                <label htmlFor="add-from-url"></label>
                <label>Add from URL:</label>
                <input type="text" name="add-from-url" id="add-from-url" />
                <input type="submit" value="Add" />
            </form>
        </>;
    }

    return <dialog open={open} style={{ zIndex: 3 }}>
        {content}
    </dialog>;
}

export default MyRecipesPage;
