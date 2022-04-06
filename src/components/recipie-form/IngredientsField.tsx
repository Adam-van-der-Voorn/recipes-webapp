import { useFormikContext, ErrorMessage, Field, FieldArrayRenderProps } from "formik";
import { useEffect, useState } from "react";
import parseUnitValInput from "./parseUnitValInput";
import { RecipieFormData } from "./RecipieForm";
import convert, { Unit } from 'convert-units';
import { UnitVal } from "../../types/recipieTypes";

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
        const anchorField = values.ingredients.list[anchor];
        const anchorQuantity: UnitVal = parseUnitValInput(anchorField.quantity);
        const val: UnitVal = parseUnitValInput(ingredient.quantity);
        const valNormlaised: number = convert(val.value)
            .from(val.unit as Unit)
            .to(anchorQuantity.unit as Unit);
        return (valNormlaised / anchorQuantity.value) * 100;
    };

    const onQuantityBlur = (idx: number) => (e: any) => {
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
        const subjectField = values.ingredients.list[idx];
        const anchorQuantity: UnitVal = parseUnitValInput(baseField.quantity);
        const subjectQuantity: UnitVal = parseUnitValInput(subjectField.quantity);
        const subjectPercentage = parseFloat(subjectField.percentage);
        const newValRelativeToBase = anchorQuantity.value * (subjectPercentage / 100);
        const newValOriginalUnit = convert(newValRelativeToBase)
            .from(anchorQuantity.unit as Unit)
            .to(subjectQuantity.unit as Unit);
        setFieldValue(`ingredients.list.${idx}.quantity`, `${newValOriginalUnit} ${subjectQuantity.unit}`);
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
                values.ingredients.list.map((ingredient, index) => {
                    let percentageField = null;
                    if (isPercentagesIncluded) {
                        if (index == anchor) {
                            percentageField = <>anchor</>;
                        }
                        else {
                            percentageField = (<>
                                <Field name={`ingredients.list.${index}.percentage`} type="text" onBlur={onPercentageBlur(index)} />%
                                <button type="button" onClick={() => setAnchor(index)}>set to anchor</button>
                            </>);
                        }
                    }

                    return (
                    <div key={index}>
                        <button type="button" onClick={() => arrayHelpers.remove(index)}>
                            -
                        </button>

                        <Field name={`ingredients.list.${index}.name`} type="text" />
                            <Field name={`ingredients.list.${index}.quantity`} type="text" onBlur={onQuantityBlur(index)} />
                            {percentageField}
                        <br />
                        <ErrorMessage name={`ingredients.list.${index}.name`} /><br />
                        <ErrorMessage name={`ingredients.list.${index}.quantity`} /><br />
                        <ErrorMessage name={`ingredients.list.${index}.percentage`} />
                    </div>
                    );
                })
            }
            <button type="button" onClick={() => arrayHelpers.push({ name: '', quantity: '', percentage: '' })}>
                +
            </button >
        </div >
    );
};

export default IngredientsField;