import { ErrorMessage, Field, FieldArrayRenderProps, useFormikContext } from "formik";
import { useEffect } from "react";
import { concatIngredients } from "../../concatIngredients";
import FormErrorMessage from "../FormErrorMessage";
import { RecipeFormData } from "../RecipeForm";

type Props = {
    index: number;
    arrayHelpers: FieldArrayRenderProps;
};

function SubstitutionRemovalsField({ index, arrayHelpers }: Props) {
    const { values } = useFormikContext<RecipeFormData>();

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
                            placeholder="all"
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
                        <FormErrorMessage name={`substitutions.${index}.removals.${idx}.quantity`} /><br />
                        <FormErrorMessage name={`substitutions.${index}.removals.${idx}.ingredientName`} />
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