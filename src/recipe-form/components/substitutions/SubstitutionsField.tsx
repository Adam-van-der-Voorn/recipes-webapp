import { Control, useWatch } from "react-hook-form";
import { RecipeInput } from "../../../types/RecipeInputTypes";

type FormHelpers = {
    control: Control<RecipeInput, any>;
};

type Props = {} & FormHelpers;

function SubstitutionsField({ control }: Props) {
    const substitutions = useWatch({control, name: "substitutions"});
    return (
        <>
            <pre>
                {JSON.stringify(substitutions, null, 2)}
            </pre>
        </>
    );
};

export default SubstitutionsField;