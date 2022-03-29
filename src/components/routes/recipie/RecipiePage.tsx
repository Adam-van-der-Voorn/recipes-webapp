import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { RecipiesContext } from "../../App";

function RecipiePage() {
    const recipieName = useParams().recipieName;
    const allRecipies = useContext(RecipiesContext).recipies;
    const recipie = allRecipies.find(value => value.name === recipieName);

    return (
        <div className="RecipiePage">
            <Link to={`/edit-${recipieName}`}>Edit</Link>
            <pre>{JSON.stringify(recipie, null, 2)}</pre>
        </div>
    );
}

export default RecipiePage;