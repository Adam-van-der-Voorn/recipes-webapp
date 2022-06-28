import { Control, useFieldArray, UseFormGetValues, UseFormRegister, UseFormReturn, UseFormSetValue, useFormState, useWatch } from "react-hook-form";
import React, { memo, useEffect, useRef } from "react";
import { RecipeFormData, RecipeInputIngredient } from "../RecipeForm";
import { MdMoreVert, MdAnchor } from 'react-icons/md';
import IconButton from "../../../components-misc/IconButton";
import MenuItemToggleable from "../../../components-misc/dropdown/MenuItemToggleable";
import DropdownMenu from "../../../components-misc/dropdown/DropdownMenu";
import MenuItemAction from "../../../components-misc/dropdown/MenuItemAction";
import FormErrorMessage from "../FormErrorMessage";

type FormHelpers = {
    control: Control<RecipeFormData, any>;
    setValue: UseFormSetValue<RecipeFormData>;
    getValues: UseFormGetValues<RecipeFormData>;
    register: UseFormRegister<RecipeFormData>;
}

type Props = {
    listIdx: number;
    listPos: number;
    isPercentagesIncluded: boolean;
    isOnlyList: boolean;
} & FormHelpers;
   

function IngredientsSubField({ listIdx, listPos, isPercentagesIncluded, isOnlyList, ...formHelpers }: Props) {
    const { control, setValue, getValues, register } = formHelpers;
    const { append, remove, update, fields: ingredients } = useFieldArray({ control, name: `ingredients.lists.${listIdx}.ingredients` });
    const { errors } = useFormState({ control })
    const lastField = useWatch({ name: `ingredients.lists.${listIdx}.ingredients.${ingredients.length - 1}`, control });
    useWatch({ name: `ingredients.anchor`, control });

    useEffect(() => {
        if (!lastField || (lastField.name !== '')) {
            // last field is not 'empty'
            const emptyField = { name: '', quantity: '', optional: false, percentage: '' };
            append(emptyField, { shouldFocus: false });
        }
    }, [lastField]);

    return (
        <>
            {!isOnlyList &&
                <div>
                    <input {...register(`ingredients.lists.${listIdx}.name`)} type="text" placeholder="Untitled List" autoComplete="off" />
                    <FormErrorMessage error={errors.ingredients?.lists?.at(listIdx)?.name} />
                </div>
            }
            <div className={`ingredient-list ${isPercentagesIncluded ? 'show-percentages' : 'hide-percentages'}`}>
                <div className="grid-header">Ingredient</div>
                <div className="grid-header">Quantity</div>
                {isPercentagesIncluded && <div className="grid-header">Proportion</div>}
                <div></div> {/* grid filler for inline button menu */}

                {
                    ingredients.map((ingredient, localIdx) => {
                        const globalIdx = listPos + localIdx;
                        const isLastField = localIdx === ingredients.length - 1;
                        const isAnchor = globalIdx === getValues().ingredients.anchor;
                        const listErrors = errors.ingredients?.lists?.at(listIdx)?.ingredients?.at(localIdx);

                        const percentageInput = (
                            <div className="percentage">
                                <input {...register(`ingredients.lists.${listIdx}.ingredients.${localIdx}.percentage`)}
                                    type="text"
                                    placeholder="?"
                                    autoComplete="off"
                                />
                                %
                            </div>
                        );

                        const percentageField = isPercentagesIncluded
                            ? isAnchor
                                ? <div className="anchor"><MdAnchor /></div>
                                : percentageInput
                            : null;

                        return (
                            <React.Fragment key={localIdx}>
                                <input {...register(`ingredients.lists.${listIdx}.ingredients.${localIdx}.name`)}
                                    type="text"
                                    className={isLastField ? "name new-ingredient" : "name"}
                                    autoComplete="off"
                                    placeholder={isLastField ? "Add new ingredient" : ""}
                                />

                                {!isLastField &&
                                    <>
                                        <input {...register(`ingredients.lists.${listIdx}.ingredients.${localIdx}.quantity`)}
                                            type="text"
                                            className="quantity"
                                            autoComplete="off"
                                        />

                                        {percentageField}

                                        <DropdownMenu trigger={<IconButton icon={MdMoreVert} size={25} tabIndex={0} />} position={'left top'} offset={['-0.8rem', '0rem']}>
                                            <MenuItemToggleable text="Optional" value={ingredient.optional} toggle={b => update(localIdx,  {
                                                name: ingredient.name,
                                                quantity: ingredient.quantity,
                                                percentage: ingredient.percentage,
                                                optional: b
                                            })} />
                                            {!isAnchor && isPercentagesIncluded &&
                                                <MenuItemAction text="Set to anchor" action={() => setValue('ingredients.anchor', globalIdx)} />
                                            }
                                            <MenuItemAction text="Delete" action={() => remove(localIdx)} />
                                        </DropdownMenu>

                                        <div className="ingredient-errors">
                                            <FormErrorMessage error={listErrors?.name} />
                                            <FormErrorMessage error={listErrors?.quantity} />
                                            <FormErrorMessage error={listErrors?.percentage} />
                                        </div>
                                    </>
                                }
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </>
    );
};

export default IngredientsSubField;