import { useNavigate } from "react-router-dom";
import RecipeCardContainer from "./RecipeCardContainer";

const headerStyle: React.CSSProperties = {
    gridTemplateColumns: '1fr minmax(30px, 300px) auto',
};

function RecipeSetPage() {
    const nav = useNavigate()

    return <>
        <header style={headerStyle}>
            <h1 className="headerTitle" style={{ whiteSpace: "nowrap"}}>My Recipes</h1>
            <input className="headerTextInput searchTextInput" type="text" />
            <button className="headerButton" onClick={() => nav("/add-recipe")}>Add Recipe</button>
        </header>
        <RecipeCardContainer />
    </>;
}

export default RecipeSetPage;
