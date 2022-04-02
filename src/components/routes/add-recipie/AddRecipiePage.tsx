import { Recipie } from "../../../types/recipieTypes";
import { useContext } from "react";
import { RecipiesContext } from "../../App";
import { useNavigate } from "react-router-dom";
import RecipieForm from "../../recipie-form/RecipieForm";

function AddRecipiePage() {
    const addRecipie = useContext(RecipiesContext).addRecipie;
    const navigate = useNavigate();

    const doSubmit = (recipie: Recipie) => {
        addRecipie(recipie);
        navigate(`/${recipie.name}`, { replace: true });
    }

    const initialValues = {
        name: '',
        timeframe: '',
        ingredients: {
            list: Array<{name: string, quantity: string, percentage: string}>(0),
            anchor: ''
        },
        servings: '',
        instructions: ''
    }

    return (
        <div className="AddRecipiePage">
           <RecipieForm doSubmit={doSubmit} initialValues={initialValues} />
        </div>
    );
}

export default AddRecipiePage;
