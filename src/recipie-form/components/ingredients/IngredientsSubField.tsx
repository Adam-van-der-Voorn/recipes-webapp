import { useFormikContext, ErrorMessage, Field, FieldArray } from "formik";
import React, { useEffect, useRef } from "react";
import { RecipieFormData, RecipieInputIngredient } from "../RecipieForm";

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
                <>
                    <div className="ingredient-list">
                        <div></div> {/* grid filler */}
                        <div>Ingredient</div>
                        <div>Quantity</div>
                        <div>Optional?</div>
                        <div></div>

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
                                    : <div className="percentage"></div>;


                                return (
                                    <React.Fragment key={localIdx}>

                                        { !isLastField && 
                                            <button type="button" onClick={() => arrayHelpers.remove(localIdx)}>
                                                -
                                            </button>
                                        }

                                        <Field name={`${ingredientNamePrefix}.name`}
                                            type="text"
                                            className={isLastField ? "name new-ingredient" : "name"}
                                            autoComplete="off"
                                            placeholder={isLastField ? "Add new ingredient" : ""}
                                        />

                                        { !isLastField &&
                                            <>
                                                <Field name={`${ingredientNamePrefix}.quantity`}
                                                    type="text"
                                                    className="quantity"
                                                    onBlur={onQuantityBlur(listIdx, localIdx)}
                                                    autoComplete="off"
                                                />

                                                <div className="optional">
                                                    <Field name={`${ingredientNamePrefix}.optional`} type="checkbox" />
                                                </div>

                                                {percentageField}

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
                </>
            } />
        </div>
    );
};

export default IngredientsSubField;