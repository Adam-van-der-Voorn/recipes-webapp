import { Link } from "react-router-dom";
import RecipieCardContainer from "./RecipieCardContainer";

import './RecipieSetPage.css';

function RecipieSetPage() {
    return (
        <div className="RecipieCardContainer">
            <Link to="/add-recipie">add a recipie!</Link>
            <RecipieCardContainer />
        </div>
    );
}

export default RecipieSetPage;
