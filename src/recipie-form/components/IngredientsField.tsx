import { useFormikContext, FieldArrayRenderProps } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { parseUnitValInput, parseUnitValInputs } from "../parseUnitValInputs";
import { RecipieFormData, RecipieInputIngredient } from "./RecipieForm";
import convert, { Unit } from 'convert-units';
import { UnitVal } from "../../types/recipieTypes";
import { isConvertableUnit, isSameMeasure } from "../../util/units";
import IngredientsSubField from "./IngredientsSubField";
import { concatIngredients } from "../concatIngredients";
import { MdMoreVert } from 'react-icons/md';
import DropdownMenu from "../../components-misc/DropdownMenu";
import IconButton from "../../components-misc/IconButton";

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
    const [hasMultipleLists, setHasMultipleLists] = useState(values.ingredients.lists.length > 1);

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
        const anchorQuantity: UnitVal | undefined = parseUnitValInput(anchorField.quantity);
        if (anchorQuantity && !isNaN(subjectPercentage)) {
            const newValRelativeToAnchor = anchorQuantity.value * (subjectPercentage / 100);
            const fieldName = `ingredients.lists.${subListIdx}.ingredients.${localIdx}.quantity`;
            const subjectQuantity: UnitVal | undefined = parseUnitValInput(subjectField.quantity);
            if (subjectQuantity && isSameMeasure(anchorQuantity.unit, subjectQuantity.unit)) {
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

    const handleMultipleListsChange = (newVal: boolean) => {
        const confirmation = () => window.confirm("Are you sure you want to switch back to having a single list? This will remove all your list names and cannot be undone.")
        if (!newVal && !confirmation()) {
            return;
        }
        setHasMultipleLists(newVal)
    }

    allIngredients.current = useMemo(() => concatIngredients(values), [values]);

    useEffect(() => {
        for (let subListIdx = 0; subListIdx < values.ingredients.lists.length; subListIdx++) {
            const subList = values.ingredients.lists[subListIdx];
            for (let localIdx = 0; localIdx < subList.ingredients.length; localIdx++) {
                setPercentageAuto(subListIdx, localIdx);
            }
        }
    }, [values.ingredients.anchor]);

    useEffect(() => {
        if (!hasMultipleLists) {
            const allIngredients = values.ingredients.lists.flatMap(list => list.ingredients);
            setFieldValue('ingredients.lists', [{name: "Main", ingredients: allIngredients}]);
        }
    }, [hasMultipleLists]);

    return (
        <>
            <h2>
                Ingredients
                <DropdownMenu trigger={<IconButton icon={MdMoreVert} size={28} />} position={'right top'} offset={['0.8rem', '0rem']}>
                    <div className="menu-button"
                        onClick={() => setIsPercentagesIncluded(oldVal => !oldVal)}
                    >
                        Toggle %
                    </div>
                    <div className="menu-button"
                        onClick={() => handleMultipleListsChange(!hasMultipleLists)}
                    >
                        Toggle multiple lists
                    </div>
                </DropdownMenu>
            </h2>
            {
                values.ingredients.lists.map((sublist, idx) => (
                    <IngredientsSubField key={idx}
                        listIdx={idx}
                        listPos={LocalToGlobalIdx(idx, 0)}
                        isPercentagesIncluded={isPercentagesIncluded}
                        isOnlyList={!hasMultipleLists}
                        onPercentageBlur={onPercentageBlur}
                        onQuantityBlur={onQuantityBlur}
                    />
                ))
            }
            {hasMultipleLists &&
                <button type="button" onClick={() => arrayHelpers.push({ name: '', ingredients: [] })}>
                    Add ingredient list
                </button >
            }

        </>
    );
};

export default IngredientsField;