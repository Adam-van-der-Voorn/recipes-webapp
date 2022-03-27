import { useContext } from "react";
import { useParams } from "react-router-dom";
import { RecipiesContext } from "../../App";

function ViewRecipiePage() {
    const recipieName = useParams().recipieName;
    const allRecipies = useContext(RecipiesContext).recipies;
    const recipie = allRecipies.find(value => value.name == recipieName);

    return (
        <div className="ViewRecipiePage">
            <pre>{JSON.stringify(recipie, null, 2)}</pre>
        </div>
    );
}

export default ViewRecipiePage;