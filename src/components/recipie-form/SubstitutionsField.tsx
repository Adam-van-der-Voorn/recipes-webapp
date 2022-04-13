import { useFormikContext, FieldArrayRenderProps, FieldArray } from "formik";
import { RecipieFormData } from "./RecipieForm";
import SubstitutionAdditionsField from "./SubstitutionAdditionsField";
import SubstitutionRemovalsField from "./SubstitutionRemovalsField";

type Props = {
    arrayHelpers: FieldArrayRenderProps;
};

function SubstitutionsField({ arrayHelpers }: Props) {
    const { values } = useFormikContext<RecipieFormData>();

    return (
        <div>
            <p>Substitutions</p>
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