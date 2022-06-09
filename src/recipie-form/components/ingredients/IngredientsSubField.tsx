import { useFormikContext, ErrorMessage, Field, FieldArray } from "formik";
import React, { useEffect, useRef } from "react";
import { RecipieFormData } from "../RecipieForm";
import { MdMoreVert, MdAnchor } from 'react-icons/md';
import IconButton from "../../../components-misc/IconButton";
import MenuItemToggleable from "../../../components-misc/dropdown/MenuItemToggleable";
import DropdownMenu from "../../../components-misc/dropdown/DropdownMenu";
import MenuItemAction from "../../../components-misc/dropdown/MenuItemAction";
import FormErrorMessage from "../FormErrorMessage";


type Props = {
    listIdx: number;
    listPos: number;
    isPercentagesIncluded: boolean;
    isOnlyList: boolean;
    onPercentageBlur: (subListIdx: number, localIdx: number) => (e: any) => void;
    onQuantityBlur: (subListIdx: number, localIdx: number) => (e: any) => void;
};

function IngredientsSubField({ listIdx, listPos, isPercentagesIncluded, isOnlyList, onPercentageBlur, onQuantityBlur }: Props) {
    const { values, setFieldValue } = useFormikContext<RecipieFormData>();
    const thisListName = `ingredients.lists.${listIdx}`;
    const thisList = values.ingredients.lists[listIdx];
    const ingredients = thisList.ingredients;
    const lastField = useRef(ingredients[ingredients.length - 1]);

    useEffect(() => {
        lastField.current = ingredients[ingredients.length - 1];
        if (!lastField.current || (lastField.current.name !== '' || lastField.current.quantity !== '')) {
            // last field is not 'empty'
            const emptyField = { name: '', quantity: '', optional: false, percentage: '' };
            setFieldValue(`${thisListName}.ingredients`, [...thisList.ingredients, emptyField]);
        }
    }, [values.ingredients.lists[listIdx].ingredients]);

    return (
        <>
            {!isOnlyList &&
                <div>
                    <Field name={`${thisListName}.name`} type="text" placeholder="Untitled List" autoComplete="off" />
                    <FormErrorMessage name={`${thisListName}.name`} />
                </div>
            }
            <FieldArray name={`${thisListName}.ingredients`} render={arrayHelpers =>
                <div className={`ingredient-list ${isPercentagesIncluded ? 'show-percentages' : 'hide-percentages'}`}>
                    <div className="grid-header">Ingredient</div>
                    <div className="grid-header">Quantity</div>
                    {isPercentagesIncluded && <div className="grid-header">Proportion</div>}
                    <div></div> {/* grid filler for inline button menu */}

                    {
                        values.ingredients.lists[listIdx].ingredients.map((ingredient, localIdx) => {
                            const globalIdx = listPos + localIdx;
                            const ingredientNamePrefix = `${thisListName}.ingredients.${localIdx}`;
                            const isLastField = localIdx === ingredients.length - 1;
                            const isAnchor = globalIdx === values.ingredients.anchor;

                            const percentageInput = (
                                <div className="percentage">
                                    <Field name={`${ingredientNamePrefix}.percentage`}
                                        type="text"
                                        onBlur={onPercentageBlur(listIdx, localIdx)}
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
                                    <Field name={`${ingredientNamePrefix}.name`}
                                        type="text"
                                        className={isLastField ? "name new-ingredient" : "name"}
                                        autoComplete="off"
                                        placeholder={isLastField ? "Add new ingredient" : ""}
                                    />

                                    {!isLastField &&
                                        <>
                                            <Field name={`${ingredientNamePrefix}.quantity`}
                                                type="text"
                                                className="quantity"
                                                onBlur={onQuantityBlur(listIdx, localIdx)}
                                                autoComplete="off"
                                            />

                                            {percentageField}

                                            <DropdownMenu trigger={<IconButton icon={MdMoreVert} size={25} tabIndex={0} />} position={'left top'} offset={['-0.8rem', '0rem']}>
                                                <MenuItemToggleable text="Optional" value={ingredients[localIdx].optional} toggle={b => setFieldValue(`${ingredientNamePrefix}.optional`, b)} />
                                                {!isAnchor && isPercentagesIncluded &&
                                                    <MenuItemAction text="Set to anchor" action={() => setFieldValue('ingredients.anchor', globalIdx)} />
                                                }
                                                <MenuItemAction text="Delete" action={() => arrayHelpers.remove(localIdx)} />
                                            </DropdownMenu>

                                            <div className="ingredient-errors">
                                                <FormErrorMessage name={`${ingredientNamePrefix}.name`} />
                                                <FormErrorMessage name={`${ingredientNamePrefix}.quantity`} />
                                                <FormErrorMessage name={`${ingredientNamePrefix}.percentage`} />
                                            </div>
                                        </>
                                    }
                                </React.Fragment>
                            );
                        })
                    }
                </div>
            } />
        </>
    );
};

export default IngredientsSubField;