import { useState } from "react";
import { SubstitutionInput } from "../../../types/RecipeInputTypes.ts";

type Props = {
  input: string;
  confirm: (substitution: SubstitutionInput) => void;
  cancel: () => void;
};

function AddSubstitution({ input: ingredientName, confirm, cancel }: Props) {
  const [substitution, setSubstitution] = useState("");
  return (
    <fieldset>
      <legend className="h-2">Add Substitution</legend>
      <div>
        <label htmlFor="sub">Substitute the {ingredientName} with</label>
        <input
          type="text"
          name={"sub"}
          className="in-string"
          onChange={(e) => setSubstitution(e.target.value)}
          autoFocus
          aria-label={`a substitute for ${ingredientName}`}
        />
      </div>
      <button
        aria-details="confirm substitution"
        type="button"
        className="primary"
        onClick={() =>
          confirm({
            additions: [substitution],
            removals: [ingredientName],
            notes: "",
          })}
      >
        Confirm
      </button>
      <button type="button" onClick={() => cancel()}>
        Cancel
      </button>
    </fieldset>
  );
}

export default AddSubstitution;
