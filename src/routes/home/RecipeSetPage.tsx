import { Link } from "react-router-dom";
import RecipeCardContainer from "./RecipeCardContainer";

function RecipeSetPage() {
    return (
        <div className="RecipeCardContainer">
            <Link to="/add-recipe">add a recipe!</Link>
            <RecipeCardContainer />
        </div>
    );
}

export default RecipeSetPage;
