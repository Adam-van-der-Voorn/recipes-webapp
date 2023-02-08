import { Control, UseFormRegister, UseFormSetValue, useFormState, useWatch } from "react-hook-form";
import React from "react";
import { MdMoreVert } from 'react-icons/md';
import IconButton from "../../../components-misc/IconButton";
import MenuItemToggleable from "../../../components-misc/dropdown/MenuItemToggleable";
import DropdownMenu from "../../../components-misc/dropdown/DropdownMenu";
import MenuItemAction from "../../../components-misc/dropdown/MenuItemAction";
import FormErrorMessage from "../FormErrorMessage";
import PercentageInput from "./PercentageInput";
import { RecipeInput, SubstitutionInput } from "../../../types/RecipeInputTypes";
import useFieldList from "../../../util/hooks/useFieldList";
import { v4 as uuid4 } from 'uuid';
import Dialog from "../../../components-misc/Dialog";
import useModal from "../../../util/hooks/useModal";
import AddSubstitution from "../substitutions/AddSubstitution";

const defaultFieldValues = { name: '', optional: false, percentage: '', quantity: ''};

type FormHelpers = {
    control: Control<RecipeInput, any>;
    setValue: UseFormSetValue<RecipeInput>;
    register: UseFormRegister<RecipeInput>;
};

type FakeTag = {
    isFake?: boolean;
}

type Props = {
    listIdx: number;
    listPos: number;
    isPercentagesIncluded: boolean;
    isNamed: boolean;
    onPercentageBlur: (subListIdx: number, localIdx: number) => (e: any) => void;
    onQuantityBlur: (subListIdx: number, localIdx: number) => (e: any) => void;
    onAnchorChange: (newAnchorIdx: number) => void;
} & FormHelpers;

function IngredientsSubField({ listIdx, listPos, isPercentagesIncluded, isNamed, onPercentageBlur, onQuantityBlur, onAnchorChange, ...formHelpers }: Props) {
    const { control, setValue, register } = formHelpers;

    const [ingredients, substitutions, currentAnchorIdx] = useWatch({control, name: [
        `ingredients.lists.${listIdx}.ingredients`,
        `substitutions`,
        `ingredients.anchor`
    ]});

    const { push, remove } = useFieldList(`ingredients.lists.${listIdx}.ingredients`, setValue, ingredients);
    const { push: addSubstitution } = useFieldList(`substitutions`, setValue, substitutions);

    const { errors } = useFormState({ control });

    // include fakeTag to ingredints type
    const rows = [...ingredients] as Array<(typeof ingredients[0]) & FakeTag>

    const lastIngredient = ingredients[ingredients.length - 1]
    if (!lastIngredient || (lastIngredient.name !== '')) {
        // last field is not 'empty'
        // push a "fake" field for the user to input the next ingredient
        rows.push({ ...defaultFieldValues, id: uuid4(), isFake: true });
    }

    const { openModal: openDialogue, modal: dialogue } = useModal<string, SubstitutionInput>(({ ...renderProps }) => (
        <Dialog open={true} onClose={() => renderProps.cancel()} closeOnBackgroudClick>
            <AddSubstitution {...renderProps} />
        </Dialog>
    ));

    const handleNewSubstitution = (result: SubstitutionInput) => {
        addSubstitution(result)
    }

    return (
        <>
            {dialogue}
            {isNamed &&
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
                    rows.map((ingredient, localIdx) => {
                        const globalIdx = listPos + localIdx;
                        const isAnchor = globalIdx === currentAnchorIdx;
                        const listErrors = errors.ingredients?.lists?.at(listIdx)?.ingredients?.at(localIdx);
                        if (ingredient.isFake) {
                            return (
                                <React.Fragment key={ingredient.id}>
                                    <input name="add-new"
                                        onChange={(ev) => push({ id: ingredient.id, ...defaultFieldValues, name: ev.target.value })}
                                        type="text"
                                        className="name new-ingredient"
                                        autoComplete="off"
                                        placeholder="Add new ingredient"
                                />
                                </React.Fragment>
                            )
                        }
                        return (
                            <React.Fragment key={ingredient.id}>
                                <input {...register(`ingredients.lists.${listIdx}.ingredients.${localIdx}.name`)}
                                    type="text"
                                    className="name"
                                    autoComplete="off"
                                />
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
                                    <MenuItemToggleable text="Optional" value={ingredient.optional} toggle={b => setValue(`ingredients.lists.${listIdx}.ingredients.${localIdx}.optional`, b)} />
                                    {!isAnchor && isPercentagesIncluded &&
                                        <MenuItemAction text="Set to anchor" action={() => onAnchorChange(globalIdx)} />
                                    }
                                    <MenuItemAction text="Delete" action={() => remove(localIdx)} />
                                    <MenuItemAction text="Provide substitution" action={() => openDialogue({input: ingredient.name, onClose: handleNewSubstitution})} />
                                </DropdownMenu>

                                <div className="ingredient-errors">
                                    <FormErrorMessage error={listErrors?.name} />
                                    <FormErrorMessage error={listErrors?.quantity} />
                                    <FormErrorMessage error={listErrors?.percentage} />
                                </div>
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </>
    );
};

export default IngredientsSubField;