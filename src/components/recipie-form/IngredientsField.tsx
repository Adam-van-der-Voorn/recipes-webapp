import { useFormikContext, ErrorMessage, Field, FieldArrayRenderProps, FieldArray } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import parseUnitValInputs from "./parseUnitValInputs";
import { RecipieFormData, RecipieInputIngredient } from "./RecipieForm";
import convert, { Unit } from 'convert-units';
import { UnitVal } from "../../types/recipieTypes";
import { isConvertableUnit, isSameMeasure } from "../../util/units";
import IngredientsSubField from "./IngredientsSubField";
import { concatIngredients } from "./concatIngredients";

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
    const allIngredients = useRef<RecipieInputIngredient[]>(concatIngredients(values));

    const LocalToGlobalIdx = (subListIdx: number, localIdx: number) => {
        let numPrecedingIngredients = 0;
        for (let i = 0; i < subListIdx; i++) {
            numPrecedingIngredients += values.ingredients.lists[i].ingredients.length;
        }
        return numPrecedingIngredients + localIdx;
    };

    const percentageFromVal = (ingredient: RecipieInputIngredient): number | undefined => {
        const anchorField = allIngredients.current[values.ingredients.anchor];
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

    const setPercentageAuto = (subListIdx: number, localIdx: number): void => {
        const ingredient = values.ingredients.lists[subListIdx].ingredients[localIdx];
        const percentage: string | number = percentageFromVal(ingredient) || '';
        setFieldValue(`ingredients.lists.${subListIdx}.ingredients.${localIdx}.percentage`, percentage);
    };

    const onQuantityBlur = (subListIdx: number, localIdx: number) => (e: any) => {
        handleBlur(e);
        const globalIdx = LocalToGlobalIdx(subListIdx, localIdx);
        if (isPercentagesIncluded) {
            if (globalIdx === values.ingredients.anchor) {
                for (let subListIdx = 0; subListIdx < values.ingredients.lists.length; subListIdx++) {
                    const subList = values.ingredients.lists[subListIdx];
                    for (let localIdx = 0; localIdx < subList.ingredients.length; localIdx++) {
                        setPercentageAuto(subListIdx, localIdx);
                    }
                }
            }
            else {
                setPercentageAuto(subListIdx, localIdx);
            }
        }
    };

    const onPercentageBlur = (subListIdx: number, localIdx: number) => (e: any) => {
        handleBlur(e);
        const anchorField = allIngredients.current[values.ingredients.anchor];
        const subIngredientList = values.ingredients.lists[subListIdx];
        const subjectField = subIngredientList.ingredients[localIdx];
        const subjectPercentage = parseFloat(subjectField.percentage);
        const quantities: UnitVal[] = parseUnitValInputs(anchorField.quantity, subjectField.quantity);
        if (quantities.length === 2 && !isNaN(subjectPercentage)) {
            const [anchorQuantity, subjectQuantity] = quantities;
            const newValRelativeToAnchor = anchorQuantity.value * (subjectPercentage / 100);
            const fieldName = `ingredients.lists.${subListIdx}.ingredients.${localIdx}.quantity`;
            if (isSameMeasure(anchorQuantity.unit, subjectQuantity.unit)) {
                const newValOriginalUnit = convert(newValRelativeToAnchor)
                    .from(anchorQuantity.unit as Unit)
                    .to(subjectQuantity.unit as Unit);
                setFieldValue(fieldName, `${newValOriginalUnit} ${subjectQuantity.unit}`);
            }
            else {
                setFieldValue(fieldName, `${newValRelativeToAnchor} ${anchorQuantity.unit}`);
            }

        }
    };

    allIngredients.current = useMemo(() => concatIngredients(values), [values]);

    useEffect(() => {
        for (let subListIdx = 0; subListIdx < values.ingredients.lists.length; subListIdx++) {
            const subList = values.ingredients.lists[subListIdx];
            for (let localIdx = 0; localIdx < subList.ingredients.length; localIdx++) {
                setPercentageAuto(subListIdx, localIdx);
            }
        }
    }, [values]);

    return (
        <div>
            <p>Ingredients</p>
            <button type="button" onClick={() => setIsPercentagesIncluded(oldVal => !oldVal)}>toggle %</button>
            {
                values.ingredients.lists.map((sublist, idx) => (
                    <IngredientsSubField key={idx}
                        listIdx={idx}
                        listPos={LocalToGlobalIdx(idx, 0)}
                        isPercentagesIncluded={isPercentagesIncluded}
                        onPercentageBlur={onPercentageBlur}
                        onQuantityBlur={onQuantityBlur}
                    />
                ))
            }
            <button type="button" onClick={() => arrayHelpers.push({ name: '', ingredients: [] })}>
                +
            </button >
        </div >
    );
};

export default IngredientsField;