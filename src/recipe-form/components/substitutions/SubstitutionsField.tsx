import { Control, UseFormSetValue, UseFormGetValues, UseFormRegister, useFieldArray } from "react-hook-form";
import { RecipeFormData } from "../RecipeForm";
import SubstitutionAdditionsField from "./SubstitutionAdditionsField";
import SubstitutionRemovalsField from "./SubstitutionRemovalsField";

type FormHelpers = {
    control: Control<RecipeFormData, any>;
    getValues: UseFormGetValues<RecipeFormData>;
    register: UseFormRegister<RecipeFormData>;
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