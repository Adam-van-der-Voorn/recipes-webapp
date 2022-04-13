import { FieldArrayRenderProps, useFormikContext } from "formik";
import { useEffect } from "react";
import { RecipieFormData } from "./RecipieForm";

type Props = {
    index: number;
    arrayHelpers: FieldArrayRenderProps;
};

function SubstitutionField({ index, arrayHelpers }: Props) {
    const { values } = useFormikContext<RecipieFormData>();

    useEffect(() => {
        console.log(values);
    }, [values]);

    return (
        <div>
            {
                values.substitutions[index].changes.map((change, idx) => (
                    <div key={idx}>
                        <button type="button" onClick={() => arrayHelpers.remove(idx)}>
                            --
                        </button>
                        <p>replace x with y...</p>
                    </div>
                ))
            }
            <button type="button" onClick={() => arrayHelpers.push({ action: '', amount: '', ingredientName: ''})}>
                ++
            </button >
            <hr />
        </div >
    );
}

export default SubstitutionField;