import { Control, useWatch } from "react-hook-form";
import { RecipeInput, SubstitutionInput } from "../../../types/RecipeInputTypes";

type FormHelpers = {
    control: Control<RecipeInput, any>;
};

type Props = {} & FormHelpers;

const isBasicSubstitution = (substitution: SubstitutionInput) => {
    return substitution.removals.length === 1 &&
        substitution.additions.length === 1
};

function SubstitutionsField({ control }: Props) {
    const substitutions = useWatch({ control, name: "substitutions" });

    return (
        <>
            {
                substitutions.map((substitution, i)=> {
                    const { removals, additions } = substitution;
                    if (isBasicSubstitution(substitution)) {
                        return (
                            <div key={i}>
                                The {removals[0]} can be substituted for {additions[0]} [Edit button]
                            </div>
                        );
                    }
                    return (
                        <pre key={i}>
                            display of this substitution is not yet suppourted :)
                            {JSON.stringify(substitution)}
                        </pre>
                    )
                })
            }
        </>
    );
};

export default SubstitutionsField;