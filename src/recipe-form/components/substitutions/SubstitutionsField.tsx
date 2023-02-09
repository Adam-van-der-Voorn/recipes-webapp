import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { RecipeInput, SubstitutionInput } from "../../../types/RecipeInputTypes";
import { MdClear } from "react-icons/md"
import useFieldList from "../../../util/hooks/useFieldList";

type FormHelpers = {
    control: Control<RecipeInput, any>;
    setValue: UseFormSetValue<RecipeInput>;
};

type Props = {} & FormHelpers;

const isBasicSubstitution = (substitution: SubstitutionInput) => {
    return substitution.removals.length === 1 &&
        substitution.additions.length === 1
};

function SubstitutionsField({ control, setValue }: Props) {
    const substitutions = useWatch({ control, name: "substitutions" });
    const { remove } = useFieldList("substitutions", setValue, substitutions)

    return (
        <>
            {
                substitutions.map((substitution, i)=> {
                    const { removals, additions } = substitution;
                    if (isBasicSubstitution(substitution)) {
                        return (
                            <p key={i}>
                                The {removals[0]} can be substituted for {additions[0]} 
                                <MdClear className="icon-button inline" style={{left: "10px"}}
                                    onClick={() => remove(i)}
                                />
                            </p>
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