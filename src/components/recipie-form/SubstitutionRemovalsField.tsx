import { Field, FieldArrayRenderProps, useFormikContext } from "formik";
import { useEffect } from "react";
import { RecipieFormData } from "./RecipieForm";

type Props = {
    index: number;
    arrayHelpers: FieldArrayRenderProps;
};

function SubstitutionRemovalsField({ index, arrayHelpers }: Props) {
    const { values } = useFormikContext<RecipieFormData>();

    useEffect(() => {
        if (values.substitutions[index].removals.length === 0) {
            arrayHelpers.push({ amount: '', ingredientName: '' });
        }
    }, []);

    return (
        <div>
            <div>replace...</div>
            {
                values.substitutions[index].removals.map((removal, idx) => (
                    <div key={idx}>
                        {idx !== 0 &&
                            <button type="button" onClick={() => arrayHelpers.remove(idx)}>
                                --
                            </button>
                        }
                        <Field name={`substitutions.${index}.removals.${idx}.quantity`} type="text" /> of
                        <Field as="select" name={`substitutions.${index}.removals.${idx}.ingredientName`} >
                            {
                                values.ingredients.list.map(ingredient => {
                                    return <option value={ingredient.name.toLowerCase()}>{ingredient.name}</option>;
                                })
                            }
                        </Field>
                        <br />
                    </div>
                ))
            }
            <button type="button" onClick={() => arrayHelpers.push({ amount: '', ingredientName: '' })}>
                ++
            </button >
        </div >
    );
}

export default SubstitutionRemovalsField;