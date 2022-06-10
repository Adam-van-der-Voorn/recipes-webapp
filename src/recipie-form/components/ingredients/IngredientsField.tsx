import { useFormikContext, FieldArrayRenderProps } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { parseUnitValInput, parseUnitValInputs } from "../../parseUnitValInputs";
import { RecipieFormData, RecipieInputIngredient } from "../RecipieForm";
import convert, { Unit } from 'convert-units';
import { UnitVal } from "../../../types/recipieTypes";
import { isConvertableUnit, isSameMeasure } from "../../../util/units";
import IngredientsSubField from "./IngredientsSubField";
import { concatIngredients } from "../../concatIngredients";
import { MdMoreVert } from 'react-icons/md';
import DropdownMenu from "../../../components-misc/dropdown/DropdownMenu";
import IconButton from "../../../components-misc/IconButton";
import './IngredientsField.css';
import MenuItemToggleable from "../../../components-misc/dropdown/MenuItemToggleable";
import { getQuantityFromPercentage } from "../../getQuantityFromPercentage";

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
        const percentage: number | undefined = percentageFromVal(ingredient);
        if (percentage) {
            setPercentage(percentage, subListIdx, localIdx);
        }
        else {
            setFieldValue(`ingredients.lists.${subListIdx}.ingredients.${localIdx}.percentage`, '');
        }
    };

    const onQuantityBlur = (subListIdx: number, localIdx: number) => (e: any) => {
        handleBlur(e);
        const quantity = parseUnitValInput(e.target.value);
        if (quantity) {
            setQuantity(quantity, subListIdx, localIdx);
        }
        if (isPercentagesIncluded) {
            const globalIdx = LocalToGlobalIdx(subListIdx, localIdx);
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
        const subIngredientList = values.ingredients.lists[subListIdx];
        const subjectField = subIngredientList.ingredients[localIdx];
        const subjectPercentage = parseFloat(subjectField.percentage);
        if (isNaN(subjectPercentage)) {
            return;
        }
        setPercentage(subjectPercentage, subListIdx, localIdx);

        const anchorField = allIngredients.current[values.ingredients.anchor];
        const anchorQuantity: UnitVal | undefined = parseUnitValInput(anchorField.quantity);
        if (anchorQuantity) {
            const subjectQuantity = parseUnitValInput(subjectField.quantity);
            const newQuantity = getQuantityFromPercentage(anchorQuantity, subjectPercentage, subjectQuantity);
            if (newQuantity) {
                setQuantity(newQuantity, subListIdx, localIdx);
            }
        }
    };

    const handleMultipleListsChange = (newVal: boolean) => {
        const confirmation = () => window.confirm("Are you sure you want to switch back to having a single list? This will remove all your list names and cannot be undone.");
        if (!newVal && !confirmation()) {
            return;
        }
        setHasMultipleLists(newVal);
    };

    const setQuantity = (quantity: UnitVal, subListIdx: number, localIdx: number) => {
        const rounded = +(quantity.value).toFixed(2);
        setFieldValue(
            `ingredients.lists.${subListIdx}.ingredients.${localIdx}.quantity`,
            `${rounded} ${quantity.unit}`
        )
    }

    const setPercentage = (percentage: number, subListIdx: number, localIdx: number) => {
        const rounded = +(percentage).toFixed(2);
        setFieldValue(
            `ingredients.lists.${subListIdx}.ingredients.${localIdx}.percentage`,
            rounded
        )
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
            setFieldValue('ingredients.lists', [{ name: "Main", ingredients: allIngredients }]);
        }
    }, [hasMultipleLists]);

    return (
        <>
            <h2>
                Ingredients
                <DropdownMenu trigger={<IconButton icon={MdMoreVert} size={28} />} position={'right top'} offset={['0.8rem', '0rem']}>
                    <MenuItemToggleable text="Use baker's percentages" value={isPercentagesIncluded} toggle={b => setIsPercentagesIncluded(b)} />
                    <MenuItemToggleable text="Use multiple lists" value={hasMultipleLists} toggle={b => handleMultipleListsChange(b)} />
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