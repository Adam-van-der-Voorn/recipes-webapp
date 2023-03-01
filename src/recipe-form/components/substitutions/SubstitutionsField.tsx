import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { RecipeInput, SubstitutionInput } from "../../../types/RecipeInputTypes";
import { MdClear } from "react-icons/md"
import useFieldList from "../../../util/hooks/useFieldList";
import { Fragment } from "react";
import style from "../RecipeForm.module.css";

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


    return <div className={style.substitutionsGrid}>
        {
            substitutions.map((substitution, i) => <Fragment key={i}>
                    <SubstitutionLabel substitution={substitution} />
                    <MdClear className={style.substitutionsRemoveButton + " icon-button"} style={{left: "10px"}}
                        onClick={() => remove(i)}
                    />
                </Fragment>
            )
        }
    </div>
};

type SubstitutionLabelProps = {
    substitution: SubstitutionInput
}

function SubstitutionLabel({substitution}: SubstitutionLabelProps) {
    const { removals, additions } = substitution;
    return isBasicSubstitution(substitution)
        ? <p>The {removals[0]} can be substituted for {additions[0]}</p>
        : (
            <pre>
                display of this substitution is not yet suppourted :)
                {JSON.stringify(substitution)}
            </pre>
        )
}

export default SubstitutionsField;