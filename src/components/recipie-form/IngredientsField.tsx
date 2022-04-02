import { useFormikContext, ErrorMessage, Field, FieldArrayRenderProps } from "formik";
import { useState } from "react";
import { RecipieFormData } from "./RecipieForm";

type Props = {
    arrayHelpers: FieldArrayRenderProps;
};

function IngredientsField({ arrayHelpers }: Props) {
    const values = useFormikContext<RecipieFormData>().values;
    const [isPercentagesIncluded, setIsPercentagesIncluded] = useState(false);

    return (
        <div>
            <p>Ingredients</p>
            <button type="button" onClick={() => setIsPercentagesIncluded(oldVal => !oldVal)}>toggle %</button>
            {
                values.ingredients.list.map((ingredient, index) => (
                    <div key={index}>
                        <button type="button" onClick={() => arrayHelpers.remove(index)}>
                            -
                        </button>
                        <Field name={`ingredients.list.${index}.name`} type="text" />
                        <Field name={`ingredients.list.${index}.quantity`} type="text" />
                        {
                            isPercentagesIncluded && 
                            <><Field name={`ingredients.list.${index}.percentage`} type="text" />%</>
                        }

                        <br />
                        <ErrorMessage name={`ingredients.list.${index}.name`} /> <br />
                        <ErrorMessage name={`ingredients.list.${index}.quantity`} /> <br />
                        <ErrorMessage name={`ingredients.list.${index}.percentage`} />
                    </div>
                ))
            }
            <button type="button" onClick={() => arrayHelpers.push({ name: '', quantity: '' })}>
                +
            </button >
        </div >
    );
};

export default IngredientsField;