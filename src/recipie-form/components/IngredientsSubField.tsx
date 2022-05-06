import { useFormikContext, ErrorMessage, Field, FieldArray } from "formik";
import React from "react";
import { RecipieFormData } from "./RecipieForm";

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
    const namePrefix = `ingredients.lists.${listIdx}`;

    return (
        <div>
            {!isOnlyList &&
                <div>
                    <Field name={`${namePrefix}.name`} type="text" placeholder="Untitled List" autoComplete="off" />
                    <ErrorMessage name={`${namePrefix}.name`} />
                </div>
            }
            <FieldArray name={`${namePrefix}.ingredients`} render={arrayHelpers =>
                <>
                    <div className="ingredient-list">
                        <div></div> {/* grid filler */}
                        <div>Ingredient</div>
                        <div>Quantity</div>
                        <div></div>
                        <div></div>

                        {
                            values.ingredients.lists[listIdx].ingredients.map((ingredient, localIdx) => {
                                const globalIdx = listPos + localIdx;
                                const ingredientNamePrefix = `${namePrefix}.ingredients.${localIdx}`;

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
                                        <button type="button" onClick={() => arrayHelpers.remove(localIdx)}>
                                            --
                                        </button>

                                        <Field name={`${ingredientNamePrefix}.name`}
                                            type="text"
                                            className="name"
                                            autoComplete="off"
                                        />
                                        <Field name={`${ingredientNamePrefix}.quantity`}
                                            type="text"
                                            className="quantity"
                                            onBlur={onQuantityBlur(listIdx, localIdx)}
                                            autoComplete="off"
                                        />
                                        <div className="optional">
                                            <label htmlFor={`${ingredientNamePrefix}.optional`}>Optional?</label>
                                            <Field name={`${ingredientNamePrefix}.optional`} type="checkbox" />
                                        </div>
                                        {percentageField}

                                        <ErrorMessage name={`${ingredientNamePrefix}.name`} />
                                        <ErrorMessage name={`${ingredientNamePrefix}.quantity`} />
                                        <ErrorMessage name={`${ingredientNamePrefix}.percentage`} />
                                    </React.Fragment>
                                );
                            })
                        }
                    </div>

                    <br /><button type="button" onClick={() => arrayHelpers.push({ name: '', quantity: '', optional: false, percentage: '' })}>
                        ++
                    </button >
                </>
            } />
        </div>
    );
};

export default IngredientsSubField;