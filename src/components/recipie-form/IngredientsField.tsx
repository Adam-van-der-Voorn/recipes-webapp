import { useFormikContext, ErrorMessage, Field, FieldArrayRenderProps } from "formik";
import { useEffect, useState } from "react";
import parseUnitValInput from "./parseUnitValInput";
import { RecipieFormData } from "./RecipieForm";

type Props = {
    arrayHelpers: FieldArrayRenderProps;
};

function IngredientsField({ arrayHelpers }: Props) {
    const {
        values,
        setFieldValue,
    } = useFormikContext<RecipieFormData>();
    const [isPercentagesIncluded, setIsPercentagesIncluded] = useState(false);
    const [anchor, setAnchor] = useState(0);

    const percentageFromVal = (ingredient: { name: string, quantity: string, percentage: string; }) => {
        const baseField = values.ingredients.list[anchor];
        // assume all same unit for now
        const base = parseUnitValInput(baseField.quantity).value;
        const val = parseUnitValInput(ingredient.quantity).value;
        return (val / base) * 100;
    };

    const onIngredientBlur = (idx: number) => (e: any) => {
        if (idx === anchor) {
            for (let i = 0; i < values.ingredients.list.length; i++) {
                const ingredient = values.ingredients.list[i];
                const percentage = percentageFromVal(ingredient);
                setFieldValue(`ingredients.list.${i}.percentage`, percentage);
            }
        }
        else {
            const ingredient = values.ingredients.list[idx];
            const percentage = percentageFromVal(ingredient);
            setFieldValue(`ingredients.list.${idx}.percentage`, percentage);
        }
    };

    const onPercentageBlur = (idx: number) => (e: any) => {
        const baseField = values.ingredients.list[anchor];
        const thisField = values.ingredients.list[idx];
        // assume grams for now
        const base = parseUnitValInput(baseField.quantity).value;
        const percentage = parseFloat(thisField.percentage);
        setFieldValue(`ingredients.list.${idx}.quantity`, `${base * (percentage / 100)}g`);
    };

    useEffect(() => {
        if (values.ingredients.list.length > 0) {
            for (let i = 0; i < values.ingredients.list.length; i++) {
                const ingredient = values.ingredients.list[i];
                const percentage = percentageFromVal(ingredient);
                setFieldValue(`ingredients.list.${i}.percentage`, percentage);
            }
            setFieldValue('ingredients.anchor', values.ingredients.list[anchor].name);
        }

    }, [anchor]);

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
                        <Field name={`ingredients.list.${index}.quantity`} type="text" onBlur={onIngredientBlur(index)} />
                        {
                            isPercentagesIncluded &&
                            <>
                                {index === anchor &&
                                    <>anchor</>
                                }
                                {index !== anchor && <>
                                    <Field name={`ingredients.list.${index}.percentage`} type="text" onBlur={onPercentageBlur(index)} />%
                                    <button type="button" onClick={() => setAnchor(index)}>set to anchor</button>
                                </>
                                }
                            </>
                        }

                        <br />
                        <ErrorMessage name={`ingredients.list.${index}.name`} /><br />
                        <ErrorMessage name={`ingredients.list.${index}.quantity`} /><br />
                        <ErrorMessage name={`ingredients.list.${index}.percentage`} />
                    </div>
                ))
            }
            <button type="button" onClick={() => arrayHelpers.push({ name: '', quantity: '', percentage: '' })}>
                +
            </button >
        </div >
    );
};

export default IngredientsField;