import { Control, UseFormRegister, UseFormSetValue, useWatch } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { parseUnitValInput } from "../../parseUnitValInputs";
import { UnitVal } from "../../../types/recipeTypes";
import IngredientsSubField from "./IngredientsSubField";
import { MdMoreVert } from 'react-icons/md';
import DropdownMenu from "../../../components-misc/dropdown/DropdownMenu";
import './IngredientsField.css';
import MenuItemToggleable from "../../../components-misc/dropdown/MenuItemToggleable";
import { getQuantityFromPercentage } from "../../getQuantityFromPercentage";
import getPercentageFromVal from "../../../util/getPercentageFromVal";
import { RecipeInput } from "../../../types/RecipeInputTypes";
import { v4 as uuid4 } from 'uuid';
import useFieldList from "../../../util/hooks/useFieldList";

type FormHelpers = {
    control: Control<RecipeInput, any>;
    setValue: UseFormSetValue<RecipeInput>;
    register: UseFormRegister<RecipeInput>;
};

type Props = {} & FormHelpers;

function IngredientsField({ setValue, control, register }: Props) {
    const lists = useWatch({control, name: "ingredients.lists"});
    const currentAnchorIdx = useWatch({control, name: "ingredients.anchor"});
    const { replace, push } = useFieldList("ingredients.lists", setValue, lists);
    const [isPercentagesIncluded, setIsPercentagesIncluded] = useState(false);
    const [hasMultipleLists, setHasMultipleLists] = useState(lists.length > 1);

    const aggregatedIngredients = lists.flatMap(list => list.ingredients);

    useEffect(() => {
        setAllPercentages(currentAnchorIdx)
    // in this case, we do want to only run on mount
    // further changes to the percentage fields will
    // be done via user input
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const localToGlobalIdx = (subListIdx: number, localIdx: number) => {
        let numPrecedingIngredients = 0;
        for (let i = 0; i < subListIdx; i++) {
            numPrecedingIngredients += lists[i].ingredients.length;
        }
        return numPrecedingIngredients + localIdx;
    };

    const setPercentageBasedOffIngredient = (subListIdx: number, localIdx: number, anchorIdx: number): void => {
        const ingredient = lists[subListIdx].ingredients[localIdx];
        const anchor = aggregatedIngredients[anchorIdx];
        const percentage: number | undefined = getPercentageFromVal(ingredient, anchor);
        if (percentage) {
            setPercentage(percentage, subListIdx, localIdx);
        }
        else {
            setValue(`ingredients.lists.${subListIdx}.ingredients.${localIdx}.percentage`, '');
        }
    };

    const setAllPercentages = (anchorIdx: number) => {
        for (let subListIdx = 0; subListIdx < lists.length; subListIdx++) {
            const subList = lists[subListIdx];
            for (let localIdx = 0; localIdx < subList.ingredients.length; localIdx++) {
                setPercentageBasedOffIngredient(subListIdx, localIdx, anchorIdx);
            }
        }
    }

    const onQuantityBlur = (subListIdx: number, localIdx: number) => (ev: any) => {
        const quantity = parseUnitValInput(ev.target.value);
        if (quantity) {
            setQuantity(quantity, subListIdx, localIdx);
        }
        const globalIdx = localToGlobalIdx(subListIdx, localIdx);
        if (globalIdx === currentAnchorIdx) {
            setAllPercentages(currentAnchorIdx)
        }
        else {
            setPercentageBasedOffIngredient(subListIdx, localIdx, currentAnchorIdx);
        }
    };

    const onPercentageBlur = (subListIdx: number, localIdx: number) => (ev: any) => {
        const subIngredientList = lists[subListIdx];
        const subjectField = subIngredientList.ingredients[localIdx];
        const subjectPercentage = parseFloat(subjectField.percentage);
        if (isNaN(subjectPercentage)) {
            return;
        }
        setPercentage(subjectPercentage, subListIdx, localIdx);

        const anchorField = aggregatedIngredients[currentAnchorIdx];
        const anchorQuantity: UnitVal | undefined | number = parseUnitValInput(anchorField.quantity);
        if (anchorQuantity) {
            const subjectQuantity = parseUnitValInput(subjectField.quantity);
            const subjectUnit = typeof subjectQuantity === 'number'
                ? undefined
                : subjectQuantity?.unit;

            const newQuantity = getQuantityFromPercentage(anchorQuantity, subjectPercentage, subjectUnit);
            if (newQuantity) {
                setQuantity(newQuantity, subListIdx, localIdx);
            }
        }
    };

    const onAnchorChange = (newAnchorIdx: number) => {
        console.log("anchor change, new idx", newAnchorIdx)
        setAllPercentages(newAnchorIdx);
        setValue("ingredients.anchor", newAnchorIdx);
    }

    const setQuantity = (quantity: UnitVal | number, subListIdx: number, localIdx: number) => {
        const s: string = typeof quantity === 'number'
            ? `${quantity}`
            : `${quantity.value} ${quantity.unit}`

        setValue(`ingredients.lists.${subListIdx}.ingredients.${localIdx}.quantity`, s, {
            shouldValidate: true
        });
    };

    const setPercentage = (percentage: number, subListIdx: number, localIdx: number) => {
        const rounded = +(percentage).toFixed(2);
        setValue(
            `ingredients.lists.${subListIdx}.ingredients.${localIdx}.percentage`,
            `${rounded}`,
            { shouldValidate: true }
        );
    };

    const handleMultipleListsChange = (_hasMultipleLists: boolean) => {
        if (!_hasMultipleLists) {
            const confirmation = () => window.confirm("Are you sure you want to switch back to having a single list? This will remove all your list names and cannot be undone.");
            if (!confirmation()) {
                return;
            }
            console.log("merging", aggregatedIngredients)
            replace([{ id: uuid4(), name: "Main", ingredients: aggregatedIngredients }]);
        }
        setHasMultipleLists(_hasMultipleLists)
    };

    return (
        <>
            <header className="h-2">
                <h2 style={{display: "inline-block", margin: 0}}>Ingredients</h2>
                <DropdownMenu trigger={<span><MdMoreVert className="icon-button inline" size={28} /></span>} position={'right top'} offset={['0.8rem', '0rem']}>
                    <MenuItemToggleable text="Use baker's percentages" value={isPercentagesIncluded} toggle={b => setIsPercentagesIncluded(b)} />
                    <MenuItemToggleable text="Use multiple lists" value={hasMultipleLists} toggle={b => handleMultipleListsChange(b)} />
                </DropdownMenu>
            </header>
            {
                lists.map((list, idx) => (
                    <IngredientsSubField key={list.id}
                        listIdx={idx}
                        listPos={localToGlobalIdx(idx, 0)}
                        isPercentagesIncluded={isPercentagesIncluded}
                        isNamed={hasMultipleLists}
                        onQuantityBlur={onQuantityBlur}
                        onPercentageBlur={onPercentageBlur}
                        onAnchorChange={onAnchorChange}
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