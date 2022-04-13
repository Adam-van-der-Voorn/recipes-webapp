import { FieldArrayRenderProps, useFormikContext } from "formik";
import { useEffect } from "react";
import { RecipieFormData } from "./RecipieForm";

type Props = {
    index: number;
    arrayHelpers: FieldArrayRenderProps;
};

function SubstitutionRemovalsField({ index, arrayHelpers }: Props) {
    const { values } = useFormikContext<RecipieFormData>();

    return (
        <div>
            <div>replace...</div>
            {
                values.substitutions[index].removals.map((removal, idx) => (
                    <div key={idx}>
                        <button type="button" onClick={() => arrayHelpers.remove(idx)}>
                            --
                        </button>
                        x
                    </div>
                ))
            }
            <button type="button" onClick={() => arrayHelpers.push({ amount: '', ingredientName: ''})}>
                ++
            </button >
        </div >
    );
}

export default SubstitutionRemovalsField;