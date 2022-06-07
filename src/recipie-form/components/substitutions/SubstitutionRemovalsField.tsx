import { ErrorMessage, Field, FieldArrayRenderProps, useFormikContext } from "formik";
import { useEffect } from "react";
import { concatIngredients } from "../../concatIngredients";
import { RecipieFormData } from "../RecipieForm";

type Props = {
    index: number;
    arrayHelpers: FieldArrayRenderProps;
};

function SubstitutionRemovalsField({ index, arrayHelpers }: Props) {
    const { values } = useFormikContext<RecipieFormData>();

    useEffect(() => {
        if (values.substitutions[index].removals.length === 0) {
            arrayHelpers.push({ quantity: '', ingredientName: '' });
        }
    }, []);

    return (
        <div>
            <label>You may substitute</label>
            {
                values.substitutions[index].removals.map((removal, idx) => (
                    <div key={idx}>
                        {idx !== 0 &&
                            <button type="button" onClick={() => arrayHelpers.remove(idx)}>
                                --
                            </button>
                        }
                        <Field name={`substitutions.${index}.removals.${idx}.quantity`}
                            type="text"
                            autoComplete="off"
                        />
                        <span>of</span>
                        <Field name={`substitutions.${index}.removals.${idx}.ingredientName`} as="select">
                            <option disabled value="">Select an ingredient</option>
                            {
                                concatIngredients(values).map(ingredient => {
                                    const name = ingredient.name;
                                    return <option key={name} value={name.toLowerCase()}>{name}</option>;
                                })
                            }
                        </Field> <br />
                        <ErrorMessage name={`substitutions.${index}.removals.${idx}.quantity`} /><br />
                        <ErrorMessage name={`substitutions.${index}.removals.${idx}.ingredientName`} />
                    </div>
                ))
            }
            <button type="button" onClick={() => arrayHelpers.push({ quantity: '', ingredientName: '' })}>
                ++
            </button >
        </div >
    );
}

export default SubstitutionRemovalsField;