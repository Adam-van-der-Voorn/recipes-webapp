import { useFieldArray, UseFormReturn, useFormState, useWatch } from "react-hook-form";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { parseUnitValInput, parseUnitValInputs } from "../../parseUnitValInputs";
import { RecipeFormData, RecipeInputIngredient } from "../RecipeForm";
import convert, { Unit } from 'convert-units';
import { UnitVal } from "../../../types/recipeTypes";
import { isConvertableUnit, isSameMeasure } from "../../../util/units";
import IngredientsSubField from "./IngredientsSubField";
import { MdMoreVert } from 'react-icons/md';
import DropdownMenu from "../../../components-misc/dropdown/DropdownMenu";
import IconButton from "../../../components-misc/IconButton";
import './IngredientsField.css';
import MenuItemToggleable from "../../../components-misc/dropdown/MenuItemToggleable";
import { getQuantityFromPercentage } from "../../getQuantityFromPercentage";

type Props = {} & UseFormReturn<RecipeFormData>;

function IngredientsField({ setValue, getValues, control, register }: Props) {
    const ingredientFormProps = { control, setValue, getValues, register }
    const { append, replace, fields: lists } = useFieldArray({ control, name: "ingredients.lists" });
    const [isPercentagesIncluded, setIsPercentagesIncluded] = useState(false);
    const [hasMultipleLists, setHasMultipleLists] = useState(lists.length > 1);

    useEffect(() => {
        if (!hasMultipleLists) {
            const l = fullIngredientList();
            console.log("concating to ", l)
            replace([{ name: "Main", ingredients: l}]);
        }
    }, [hasMultipleLists]);

    useEffect(() => {
        console.log("lists", lists)
        console.log("full list", fullIngredientList())
    }, [lists])

    const fullIngredientList = () => getValues().ingredients.lists.flatMap(list => list.ingredients);

    const LocalToGlobalIdx = (subListIdx: number, localIdx: number) => { // TODO: lists
        let numPrecedingIngredients = 0;
        for (let i = 0; i < subListIdx; i++) {
            numPrecedingIngredients += getValues().ingredients.lists[i].ingredients.length;
        }
        return numPrecedingIngredients + localIdx;
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
                lists.map((sublist, idx) => (
                    <IngredientsSubField key={sublist.id}
                        listIdx={idx}
                        listPos={LocalToGlobalIdx(idx, 0)}
                        isPercentagesIncluded={isPercentagesIncluded}
                        isOnlyList={!hasMultipleLists}
                        {...ingredientFormProps}
                    />
                ))
            }
            {hasMultipleLists &&
                <button type="button" onClick={() => append({ name: '', ingredients: [] })}>
                    Add ingredient list
                </button >
            }
        </>
    );
};

export default IngredientsField;