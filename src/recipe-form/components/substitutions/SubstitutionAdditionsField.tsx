import { ErrorMessage, Field, FieldArrayRenderProps, useFormikContext } from "formik";
import { useEffect } from "react";
import FormErrorMessage from "../FormErrorMessage";
import { RecipeFormData } from "../RecipeForm";

type Props = {
    index: number;
    arrayHelpers: FieldArrayRenderProps;
};

function SubstitutionAdditionsField({ index, arrayHelpers }: Props) {
    const { values } = useFormikContext<RecipeFormData>();

    useEffect(() => {
        if (values.substitutions[index].additions.length === 0) {
            arrayHelpers.push({ quantity: '', ingredientName: '' });
        }
    }, []);

    return (
        <div>
            <p>with...</p>
            {
                values.substitutions[index].additions.map((addition, idx) => (
                    <div key={idx}>
                        {idx !== 0 &&
                            <button type="button" onClick={() => arrayHelpers.remove(idx)}>
                                --
                            </button>
                        }
                        <Field name={`substitutions.${index}.additions.${idx}.quantity`}
                            type="text"
                            autoComplete="off"
                        />
                        <span>of</span>
                        <Field name={`substitutions.${index}.additions.${idx}.ingredientName`}
                            type="text"
                            autoComplete="off"
                        />
                        <br />
                        <FormErrorMessage name={`substitutions.${index}.additions.${idx}.quantity`} /><br />
                        <FormErrorMessage name={`substitutions.${index}.additions.${idx}.ingredientName`} />
                    </div>
                ))
            }
            <button type="button" onClick={() => arrayHelpers.push({ quantity: '', ingredientName: '' })}>
                ++
            </button >
        </div >
    );
}

export default SubstitutionAdditionsField;