import { useContext } from "react";
import { RecipiesContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Recipie } from "../../types/recipieTypes";
import RecipieForm from "../../recipie-form/components/RecipieForm";

function AddRecipiePage() {
    const addRecipie = useContext(RecipiesContext).addRecipie;
    const navigate = useNavigate();

    const doSubmit = (recipie: Recipie) => {
        addRecipie(recipie, (id) => {
            navigate(`/view-${id}`, { replace: true });
        });
    };

    const initialValues = {
        name: '',
        timeframe: '',
        makes: '',
        notes: '',
        ingredients: {
            lists: [{
                name: 'Main',
                ingredients: []
            }],
            anchor: 0
        },
        servings: '',
        instructions: [],
        substitutions: [],
    };

    return (
        <div className="AddRecipiePage">
            <RecipieForm doSubmit={doSubmit} initialValues={initialValues} />
        </div>
    );
}

export default AddRecipiePage;
