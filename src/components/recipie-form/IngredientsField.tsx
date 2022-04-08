import { useFormikContext, ErrorMessage, Field, FieldArrayRenderProps } from "formik";
import { useEffect, useState } from "react";
import parseUnitValInputs from "./parseUnitValInputs";
import { RecipieFormData } from "./RecipieForm";
import convert, { Unit } from 'convert-units';
import { UnitVal } from "../../types/recipieTypes";
import { isConvertableUnit, isSameMeasure } from "../../util/units";

type Props = {
    arrayHelpers: FieldArrayRenderProps;
};

function IngredientsField({ arrayHelpers }: Props) {
    const {
        values,
        setFieldValue,
        handleBlur
    } = useFormikContext<RecipieFormData>();
    const [isPercentagesIncluded, setIsPercentagesIncluded] = useState(false);
    const [anchor, setAnchor] = useState(0);

    const percentageFromVal = (ingredient: { name: string, quantity: string, percentage: string; }): number | undefined => {
        const anchorField = values.ingredients.list[anchor];
        const quantities: UnitVal[] = parseUnitValInputs(anchorField.quantity, ingredient.quantity);
        if (quantities.length === 2 && isSameMeasure(quantities[0].unit, quantities[1].unit)) {
            const [anchorQuantity, ingredientQuantity]: UnitVal[] = quantities;
            if (isConvertableUnit(ingredientQuantity.unit)) {
                const ingredientValNormalised: number = convert(ingredientQuantity.value)
                    .from(ingredientQuantity.unit as Unit)
                    .to(anchorQuantity.unit as Unit);
                return (ingredientValNormalised / anchorQuantity.value) * 100;
            }
            else {
                return (ingredientQuantity.value / anchorQuantity.value) * 100;
            }

        }
        else {
            return undefined;
        }

    };

    const setPercentageAuto = (index: number): void => {
        const ingredient = values.ingredients.list[index];
        const percentage: string | number = percentageFromVal(ingredient) || '';
        setFieldValue(`ingredients.list.${index}.percentage`, percentage);
    };

    const onQuantityBlur = (idx: number) => (e: any) => {
        handleBlur(e)
        if (isPercentagesIncluded) {
            if (idx === anchor) {
                for (let i = 0; i < values.ingredients.list.length; i++) {
                   setPercentageAuto(i);
                }
            }
            else {
                setPercentageAuto(idx);
            }
        }
    };

    const onPercentageBlur = (idx: number) => (e: any) => {
        handleBlur(e);
        const anchorField = values.ingredients.list[anchor];
        const subjectField = values.ingredients.list[idx];
        const subjectPercentage = parseFloat(subjectField.percentage);
        const quantities: UnitVal[] = parseUnitValInputs(anchorField.quantity, subjectField.quantity);
        if (quantities.length === 2 && !isNaN(subjectPercentage)) {
            const [anchorQuantity, subjectQuantity] = quantities;
            const newValRelativeToAnchor = anchorQuantity.value * (subjectPercentage / 100);
            if (isSameMeasure(anchorQuantity.unit, subjectQuantity.unit)) {
                const newValOriginalUnit = convert(newValRelativeToAnchor)
                    .from(anchorQuantity.unit as Unit)
                    .to(subjectQuantity.unit as Unit);
                setFieldValue(`ingredients.list.${idx}.quantity`, `${newValOriginalUnit} ${subjectQuantity.unit}`);
            }
            else {
                setFieldValue(`ingredients.list.${idx}.quantity`, `${newValRelativeToAnchor} ${anchorQuantity.unit}`);
            }

        }
    };

    useEffect(() => {
        if (values.ingredients.list.length > 0) {
            for (let i = 0; i < values.ingredients.list.length; i++) {
                setPercentageAuto(i);
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
                        if (index === anchor) {
                            percentageField = <>anchor</>;
                        }
                        else {
                            percentageField = (<>
                                <Field name={`ingredients.list.${index}.percentage`} type="text" onBlur={onPercentageBlur(index)} placeholder="?" />%
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