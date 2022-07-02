import { Control, useFieldArray, UseFormGetValues, UseFormRegister, UseFormSetValue, useFormState, useWatch } from "react-hook-form";
import React, { useEffect } from "react";
import { MdMoreVert, MdAnchor } from 'react-icons/md';
import IconButton from "../../../components-misc/IconButton";
import MenuItemToggleable from "../../../components-misc/dropdown/MenuItemToggleable";
import DropdownMenu from "../../../components-misc/dropdown/DropdownMenu";
import MenuItemAction from "../../../components-misc/dropdown/MenuItemAction";
import FormErrorMessage from "../FormErrorMessage";
import PercentageInput from "./PercentageInput";
import { RecipeInput } from "../../../types/RecipeInputTypes";

type FormHelpers = {
    control: Control<RecipeInput, any>;
    setValue: UseFormSetValue<RecipeInput>;
    getValues: UseFormGetValues<RecipeInput>;
    register: UseFormRegister<RecipeInput>;
};

type Props = {
    listIdx: number;
    listPos: number;
    isPercentagesIncluded: boolean;
    isOnlyList: boolean;
    onPercentageBlur: (subListIdx: number, localIdx: number) => (e: any) => void;
    onQuantityBlur: (subListIdx: number, localIdx: number) => (e: any) => void;
} & FormHelpers;

function IngredientsSubField({ listIdx, listPos, isPercentagesIncluded, isOnlyList, onPercentageBlur, onQuantityBlur, ...formHelpers }: Props) {
    const { control, setValue, getValues, register } = formHelpers;
    const { append, remove, update, fields } = useFieldArray({ control, name: `ingredients.lists.${listIdx}.ingredients` });
    const { errors } = useFormState({ control });
    useWatch({ name: `ingredients.anchor`, control });

    useEffect(() => {
        const currentIngredients = getValues().ingredients.lists[listIdx].ingredients;
        const lastField = currentIngredients[currentIngredients.length - 1]
        if (!lastField || (lastField.name !== '')) {
            // last field is not 'empty'
            const emptyField = { name: '', quantity: '', optional: false, percentage: '' };
            append(emptyField, { shouldFocus: false });
        }
    });

    return (
        <>
            {!isOnlyList &&
                <div>
                    <input {...register(`ingredients.lists.${listIdx}.name`)}
                        type="text"
                        className="ingredients-sublist-name"
                        placeholder="Untitled List"
                        autoComplete="off" />
                    <FormErrorMessage error={errors.ingredients?.lists?.at(listIdx)?.name} />
                </div>
            }
            <div className={`ingredient-list ${isPercentagesIncluded ? 'show-percentages' : 'hide-percentages'}`}>
                <div className="grid-header">Ingredient</div>
                <div className="grid-header">Quantity</div>
                {isPercentagesIncluded && <div className="grid-header">Proportion</div>}
                <div></div> {/* grid filler for inline button menu */}

                {
                    fields.map((ingredient, localIdx) => {
                        const globalIdx = listPos + localIdx;
                        const isLastField = localIdx === fields.length - 1;
                        const isAnchor = globalIdx === getValues().ingredients.anchor;
                        const listErrors = errors.ingredients?.lists?.at(listIdx)?.ingredients?.at(localIdx);

                        return (
                            <React.Fragment key={ingredient.id}>
                                <input {...register(`ingredients.lists.${listIdx}.ingredients.${localIdx}.name`)}
                                    type="text"
                                    className={isLastField ? "name new-ingredient" : "name"}
                                    autoComplete="off"
                                    placeholder={isLastField ? "Add new ingredient" : ""}
                                />

                                {!isLastField &&
                                    <>
                                        <input {...register(`ingredients.lists.${listIdx}.ingredients.${localIdx}.quantity`, {
                                            onBlur: onQuantityBlur(listIdx, localIdx)
                                        })}
                                            type="text"
                                            className="quantity"
                                            autoComplete="off"
                                        />

                                        {isPercentagesIncluded &&
                                            <PercentageInput {...register(`ingredients.lists.${listIdx}.ingredients.${localIdx}.percentage`, {
                                                onBlur: onPercentageBlur(listIdx, localIdx)
                                            })}
                                                isAnchor={isAnchor}
                                            />
                                        }

                                        <DropdownMenu trigger={<IconButton icon={MdMoreVert} size={25} tabIndex={0} />} position={'left top'} offset={['-0.8rem', '0rem']}>
                                            <MenuItemToggleable text="Optional" value={ingredient.optional} toggle={b => update(localIdx, { name: ingredient.name, quantity: ingredient.quantity, percentage: ingredient.percentage, optional: b })} />
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