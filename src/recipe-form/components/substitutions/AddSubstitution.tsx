import { useState } from "react";
import { SubstitutionInput } from "../../../types/RecipeInputTypes";

type Props = {
    input: string,
    confirm: (substitution: SubstitutionInput) => void;
    cancel: () => void;
};

function AddSubstitution({ input: ingredientName, confirm, cancel }: Props) {
    const [substitution, setSubstitution] = useState("");
    return (
        <>
            <h2>Add Substitution</h2>
            <p>
                <span>Substitute the {ingredientName} with an equal amount of </span>
                <input type="text" className="in-string" onChange={e => setSubstitution(e.target.value)} autoFocus />
            </p>
            <button type="button" className="primary" onClick={() => confirm({
                additions: [{
                    ingredientName: substitution,
                    proportion: '1'
                }],
                removals: [ingredientName]
            })}>
                Confirm
            </button>
            <button type="button" onClick={() => cancel()}>
                Cancel
            </button>
        </>
    );
};

export default AddSubstitution;;