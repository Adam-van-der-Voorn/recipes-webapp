import { useFormikContext, ErrorMessage, Field, FieldArray } from "formik";
import React, { useEffect, useRef } from "react";
import { RecipieFormData } from "../RecipieForm";
import { MdMoreVert } from 'react-icons/md';
import IconButton from "../../../components-misc/IconButton";
import DropdownMenu from "../../../components-misc/DropdownMenu";


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
        <div>
            {!isOnlyList &&
                <div>
                    <Field name={`${thisListName}.name`} type="text" placeholder="Untitled List" autoComplete="off" />
                    <ErrorMessage name={`${thisListName}.name`} />
                </div>
            }
            <FieldArray name={`${thisListName}.ingredients`} render={arrayHelpers =>
                <div className={`ingredient-list ${isPercentagesIncluded ? 'show-percentages' : 'hide-percentages'}`}>
                    <div>Ingredient</div>
                    <div>Quantity</div>
                    { isPercentagesIncluded && <div>Proportion</div>}
                    <div></div> {/* grid filler for inline button menu */}

                    {
                        values.ingredients.lists[listIdx].ingredients.map((ingredient, localIdx) => {
                            const globalIdx = listPos + localIdx;
                            const ingredientNamePrefix = `${thisListName}.ingredients.${localIdx}`;
                            const isLastField = localIdx === ingredients.length - 1;

                            const percentageInput = (
                                <div className="percentage">
                                    <Field name={`${ingredientNamePrefix}.percentage`}
                                        type="text"
                                        onBlur={onPercentageBlur(listIdx, localIdx)}
                                        placeholder="?"
                                        autoComplete="off"
                                    />
                                    %
                                    <button type="button" onClick={() => setFieldValue('ingredients.anchor', globalIdx)}>set to anchor</button>
                                </div>
                            );

                            const percentageField = isPercentagesIncluded
                                ? globalIdx === values.ingredients.anchor
                                    ? <div className="percentage">anchor</div>
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
                                                <div className="menu-button" onClick={() => arrayHelpers.remove(localIdx)}>
                                                    Delete
                                                </div>
                                                <div className="menu-button" onClick={() => setFieldValue(`${ingredientNamePrefix}.optional`, !ingredients[localIdx].optional)}>
                                                    Toggle optional
                                                </div>
                                            </DropdownMenu>

                                            <div className="ingredient-error">
                                                <ErrorMessage name={`${ingredientNamePrefix}.name`} />
                                                <ErrorMessage name={`${ingredientNamePrefix}.quantity`} />
                                                <ErrorMessage name={`${ingredientNamePrefix}.percentage`} />
                                            </div>
                                        </>
                                    }
                                </React.Fragment>
                            );
                        })
                    }
                </div>
            } />
        </div>
    );
};

export default IngredientsSubField;