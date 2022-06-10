import { useFormikContext, FieldArrayRenderProps, FieldArray } from "formik";
import { RecipeFormData } from "../RecipeForm";
import SubstitutionAdditionsField from "./SubstitutionAdditionsField";
import SubstitutionRemovalsField from "./SubstitutionRemovalsField";

type Props = {
    arrayHelpers: FieldArrayRenderProps;
};

function SubstitutionsField({ arrayHelpers }: Props) {
    const { values } = useFormikContext<RecipeFormData>();

    return (
        <div>
            <h2>Substitutions</h2>
            {
                values.substitutions.map((substitution, index) => (
                    <div key={index}>
                        <button type="button" onClick={() => arrayHelpers.remove(index)}>
                            -
                        </button>
                        <FieldArray name={`substitutions.${index}.removals`} render={removalsArrayHelpers => (
                            <SubstitutionRemovalsField index={index} arrayHelpers={removalsArrayHelpers} />
                        )} />
                        <FieldArray name={`substitutions.${index}.additions`} render={additionsArrayHelpers => (
                            <SubstitutionAdditionsField index={index} arrayHelpers={additionsArrayHelpers} />
                        )} />
                        <hr/>
                    </div>
                ))
            }
            <button type="button" onClick={() => arrayHelpers.push({ additions: [], removals: [] })}>
                +
            </button >
        </div >
    );
};

export default SubstitutionsField;