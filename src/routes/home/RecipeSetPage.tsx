import { Link } from "react-router-dom";
import RecipeCardContainer from "./RecipeCardContainer";



function RecipeSetPage() {
    return (
        <div style={{
            height: "100%",
            display: "grid",
            gridTemplateColumns: "auto",
            gridTemplateRows: "auto 1fr"
        }}>
            <Link to="/add-recipe">add a recipe!</Link>
            <RecipeCardContainer />
        </div>
    );
}

export default RecipeSetPage;
