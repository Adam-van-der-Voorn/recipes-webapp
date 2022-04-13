import { FieldArrayRenderProps, useFormikContext } from "formik";
import { useEffect } from "react";
import { RecipieFormData } from "./RecipieForm";

type Props = {
    index: number;
    arrayHelpers: FieldArrayRenderProps;
};

function SubstitutionAdditionsField({ index, arrayHelpers }: Props) {
    const { values } = useFormikContext<RecipieFormData>();

    return (
        <div>
            <div>with...</div>
            {
                values.substitutions[index].additions.map((addition, idx) => (
                    <div key={idx}>
                        <button type="button" onClick={() => arrayHelpers.remove(idx)}>
                            --
                        </button>
                        y
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