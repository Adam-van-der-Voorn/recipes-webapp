import { useFormikContext, ErrorMessage, Field, FieldArrayRenderProps } from "formik";
import FormErrorMessage from "./FormErrorMessage";
import { RecipeFormData } from "./RecipeForm";

type Props = {
    arrayHelpers: FieldArrayRenderProps;
};

function InstructionsField({ arrayHelpers }: Props) {
    const { values } = useFormikContext<RecipeFormData>();

    return (
        <div>
            <h2>Method</h2>
            {
                values.instructions.map((instruction, index) => (
                    <div key={index}>
                        <button type="button" onClick={() => arrayHelpers.remove(index)}>
                            -
                        </button>
                        {`${index + 1}. `}
                        <Field name={`instructions.${index}`} as="textarea" /><br />
                        <FormErrorMessage name={`instructions.${index}`} />
                    </div>
                ))
            }
            <button type="button" onClick={() => arrayHelpers.push('')}>
                +
            </button >
        </div >
    );
};

export default InstructionsField;