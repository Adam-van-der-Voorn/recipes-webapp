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
        <Dialogue isOpen={dialogueOpen} close={() => setDialogueOpen(false)} />
        <AuthGate>
            <MyRecipesPageContent />
        </AuthGate>
    </div>;
}

type DialogProps = {
    isOpen: boolean;
    close: () => void
};

function Dialogue({ isOpen, close }: DialogProps) {
    const { user } = useContext(GlobalContext);

    let content;
    if (user === "pre-auth" || user === null) {
        content = "no user";
    }
    else {
        const closeButtonStyle = {
            float: "right",
            fontSize: 'smaller',
            paddingTop: '2px',
            paddingBottom: '2px',
        };
        content = <>
            <Link to="/add-recipe">Manual</Link>
            {" · "}
            <Link to="/add-recipe-from-url">From URL</Link>
            {/* @ts-ignore */}
            <button style={closeButtonStyle} onClick={close}>Close</button>

        </>;
    }

    return <dialog open={isOpen} style={{ zIndex: 3 }}>
        {content}
    </dialog>;
}

export default MyRecipesPage;
