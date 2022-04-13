import { useFormikContext, FieldArrayRenderProps, FieldArray } from "formik";
import { RecipieFormData } from "./RecipieForm";
import SubstitutionField from "./SubstitutionField";

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
                        <FieldArray name={`substitutions.${index}.changes`} render={changesArrayHelpers => (
                            <SubstitutionField index={index} arrayHelpers={changesArrayHelpers} />
                        )} />
                    </div>
                ))
            }
            <button type="button" onClick={() => arrayHelpers.push({ changes: [] })}>
                +
            </button >
        </div >
    );
};

export default SubstitutionsField;