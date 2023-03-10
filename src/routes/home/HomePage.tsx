import { Link } from "react-router-dom";
import RecipeCardContainer from "./RecipeCardContainer";

import './HomePage.css';

function HomePage() {
    return (
        <div style={{
            height: "100%",
            display: "grid",
            gridTemplateColumns: "auto",
            gridTemplateRows: "auto 1fr"
        }}>
            <Link to="/add-recipe">add a recipe!</Link>
            <Link to="/site-import">import recipie from link</Link>

            <RecipeCardContainer />
        </div>
    );
}

export default HomePage;
