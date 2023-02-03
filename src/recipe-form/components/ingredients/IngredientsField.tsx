import { Control, UseFormRegister, UseFormSetValue, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { parseUnitValInput } from "../../parseUnitValInputs";
import { UnitVal } from "../../../types/recipeTypes";
import IngredientsSubField from "./IngredientsSubField";
import { MdMoreVert } from 'react-icons/md';
import DropdownMenu from "../../../components-misc/dropdown/DropdownMenu";
import IconButton from "../../../components-misc/IconButton";
import './IngredientsField.css';
import MenuItemToggleable from "../../../components-misc/dropdown/MenuItemToggleable";
import { getQuantityFromPercentage } from "../../getQuantityFromPercentage";
import getPercentageFromVal from "../../../util/getPercentageFromVal";
import { RecipeInput } from "../../../types/RecipeInputTypes";
import useFieldList from "../../../util/hooks/useFieldList";
import { v4 as uuid4 } from 'uuid';

type FormHelpers = {
    control: Control<RecipeInput, any>;
    setValue: UseFormSetValue<RecipeInput>;
    register: UseFormRegister<RecipeInput>;
};

type Props = {} & FormHelpers;

function IngredientsField({ setValue, control, register }: Props) {
    const lists = useWatch({control, name: "ingredients.lists"});
    const anchorIdx = useWatch({control, name: "ingredients.anchor"});
    const { replace, push } = useFieldList("ingredients.lists", setValue, lists);
    const [isPercentagesIncluded, setIsPercentagesIncluded] = useState(false);
    const [hasMultipleLists, setHasMultipleLists] = useState(lists.length > 1);

    useEffect(() => {
        if (!hasMultipleLists) {
            const l = lists
                .flatMap(list => list.ingredients.slice(0, -1));
            replace([{ id: uuid4(), name: "Main", ingredients: l }]);
        }
    }, [hasMultipleLists]);

    useEffect(() => {
        for (let subListIdx = 0; subListIdx < lists.length; subListIdx++) {
            const subList = lists[subListIdx];
            for (let localIdx = 0; localIdx < subList.ingredients.length; localIdx++) {
                setPercentageBasedOffIngredient(subListIdx, localIdx);
            }
        }
    }, [anchorIdx]);

    const fullIngredientList = () => lists.flatMap(list => list.ingredients);

    const LocalToGlobalIdx = (subListIdx: number, localIdx: number) => {
        let numPrecedingIngredients = 0;
        for (let i = 0; i < subListIdx; i++) {
            numPrecedingIngredients += lists[i].ingredients.length;
        }
        return numPrecedingIngredients + localIdx;
    };

    const setPercentageBasedOffIngredient = (subListIdx: number, localIdx: number): void => {
        const ingredient = lists[subListIdx].ingredients[localIdx];
        const anchor = fullIngredientList()[anchorIdx];
        const percentage: number | undefined = getPercentageFromVal(ingredient, anchor);
        if (percentage) {
            setPercentage(percentage, subListIdx, localIdx);
        }
        else {
            setValue(`ingredients.lists.${subListIdx}.ingredients.${localIdx}.percentage`, '');
        }
    };

    const onQuantityBlur = (subListIdx: number, localIdx: number) => (e: any) => {
        const quantity = parseUnitValInput(e.target.value);
        if (quantity) {
            setQuantity(quantity, subListIdx, localIdx);
        }
        if (isPercentagesIncluded) {
            const globalIdx = LocalToGlobalIdx(subListIdx, localIdx);
            if (globalIdx === anchorIdx) {
                for (let subListIdx = 0; subListIdx < lists.length; subListIdx++) {
                    const subList = lists[subListIdx];
                    for (let localIdx = 0; localIdx < subList.ingredients.length; localIdx++) {
                        setPercentageBasedOffIngredient(subListIdx, localIdx);
                    }
                }
            }
            else {
                setPercentageBasedOffIngredient(subListIdx, localIdx);
            }
        }
    };

    const onPercentageBlur = (subListIdx: number, localIdx: number) => (e: any) => {
        const subIngredientList = lists[subListIdx];
        const subjectField = subIngredientList.ingredients[localIdx];
        const subjectPercentage = parseFloat(subjectField.percentage);
        if (isNaN(subjectPercentage)) {
            return;
        }
        setPercentage(subjectPercentage, subListIdx, localIdx);

        const anchorField = fullIngredientList()[anchorIdx];
        const anchorQuantity: UnitVal | undefined = parseUnitValInput(anchorField.quantity);
        if (anchorQuantity) {
            const subjectQuantity = parseUnitValInput(subjectField.quantity);
            const newQuantity = getQuantityFromPercentage(anchorQuantity, subjectPercentage, subjectQuantity);
            if (newQuantity) {
                setQuantity(newQuantity, subListIdx, localIdx);
            }
        }
    };

    const setQuantity = (quantity: UnitVal, subListIdx: number, localIdx: number) => {
        const rounded = +(quantity.value).toFixed(2);
        setValue(
            `ingredients.lists.${subListIdx}.ingredients.${localIdx}.quantity`,
            `${rounded} ${quantity.unit}`,
            { shouldValidate: true }
        );
    };

    const setPercentage = (percentage: number, subListIdx: number, localIdx: number) => {
        const rounded = +(percentage).toFixed(2);
        setValue(
            `ingredients.lists.${subListIdx}.ingredients.${localIdx}.percentage`,
            `${rounded}`,
            { shouldValidate: true }
        );
    };

    const handleMultipleListsChange = (newVal: boolean) => {
        const confirmation = () => window.confirm("Are you sure you want to switch back to having a single list? This will remove all your list names and cannot be undone.");
        if (!newVal && !confirmation()) {
            return;
        }
        setHasMultipleLists(newVal);
    };

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
                lists.map((list, idx) => (
                    <IngredientsSubField key={list.id}
                        listIdx={idx}
                        listPos={LocalToGlobalIdx(idx, 0)}
                        isPercentagesIncluded={isPercentagesIncluded}
                        isOnlyList={!hasMultipleLists}
                        onQuantityBlur={onQuantityBlur}
                        onPercentageBlur={onPercentageBlur}
                        {...{register, setValue, control}}
                    />
                ))
            }
            {hasMultipleLists &&
                <button type="button" onClick={() => push({ id: uuid4(), name: '', ingredients: [] })}>
                    Add ingredient list
                </button >
            }
        </>
    );
};

export default IngredientsField;