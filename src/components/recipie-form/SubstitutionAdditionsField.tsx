import { Field, FieldArrayRenderProps, useFormikContext } from "formik";
import { useEffect } from "react";
import { RecipieFormData } from "./RecipieForm";

type Props = {
    index: number;
    arrayHelpers: FieldArrayRenderProps;
};

function SubstitutionAdditionsField({ index, arrayHelpers }: Props) {
    const { values } = useFormikContext<RecipieFormData>();

    useEffect(() => {
        if (values.substitutions[index].additions.length === 0) {
            arrayHelpers.push({ amount: '', ingredientName: '' });
        }
    }, [])

    return (
        <div>
            <div>with...</div>
            {
                values.substitutions[index].additions.map((addition, idx) => (
                    <div key={idx}>
                        {   idx !== 0 && 
                            <button type="button" onClick={() => arrayHelpers.remove(idx)}>
                                --
                            </button>
                        }
                        <Field name={`substitutions.${index}.additions.${idx}.quantity`} type="text" /> of
                        <Field name={`substitutions.${index}.additions.${idx}.ingredientName`} type="text" />
                    </div>
                ))
            }
            <button type="button" onClick={() => arrayHelpers.push({ amount: '', ingredientName: '' })}>
                ++
            </button >
        </div >
    );
}

export default SubstitutionAdditionsField;