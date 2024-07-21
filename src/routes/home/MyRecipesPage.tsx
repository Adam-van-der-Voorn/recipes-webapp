import { useNavigate } from "react-router-dom";
import MyRecipesPageContent from "./MyRecipesPageContent";
import { useWindowDimensions } from "../../util/hooks/useWindowDimensions";
import { useLayoutEffect, useRef, useState } from "react";
import AuthGate from "../../auth/AuthGate";

const minSearchbarSizePx = 30;

function MyRecipesPage() {
    const nav = useNavigate();
    const { windowWidth } = useWindowDimensions();
    const searchBarRef = useRef<HTMLInputElement>(null);
    const [displayTitle, setDisplayTitle] = useState(false);

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
                onClick={() => nav("/add-recipe")}
            >Add Recipe
            </button>
        </header>
        <AuthGate>
            <MyRecipesPageContent />
        </AuthGate>
    </div>;
}

export default MyRecipesPage;
