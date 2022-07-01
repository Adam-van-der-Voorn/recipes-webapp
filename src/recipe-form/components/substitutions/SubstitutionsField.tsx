import { Control, UseFormGetValues, UseFormRegister, useFieldArray } from "react-hook-form";
import { RecipeInput } from "../../../types/RecipeInputTypes";
import SubstitutionAdditionsField from "./SubstitutionAdditionsField";
import SubstitutionRemovalsField from "./SubstitutionRemovalsField";

type FormHelpers = {
    control: Control<RecipeInput, any>;
    getValues: UseFormGetValues<RecipeInput>;
    register: UseFormRegister<RecipeInput>;
}

type Props = { } & FormHelpers; 

function SubstitutionsField({ ...formHelpers }: Props) {
    const { control, register, getValues } = formHelpers;
    const { fields: substitutions, remove, append } = useFieldArray({ control, name: "substitutions" });

    return (
        <div>
            <h2>Substitutions</h2>
            {
                substitutions.map((substitution, index) => (
                    <div key={substitution.id}>
                        <button type="button" onClick={() => remove(index)}>
                            -
                        </button>
                        <SubstitutionRemovalsField index={index}
                            {...{control, register, getValues}}
                        />
                        <SubstitutionAdditionsField index={index}
                            {...{control, register}}
                        />
                        <hr/>
                    </div>
                ))
            }
            <button type="button" onClick={() => append({ additions: [], removals: [] })}>
                +
            </button >
        </div >
    );
};

export default SubstitutionsField;