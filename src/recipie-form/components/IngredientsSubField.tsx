import { useFormikContext, ErrorMessage, Field, FieldArray } from "formik";
import { RecipieFormData } from "./RecipieForm";

type Props = {
    listIdx: number;
    listPos: number;
    isPercentagesIncluded: boolean;
    onPercentageBlur: (subListIdx: number, localIdx: number) => (e: any) => void;
    onQuantityBlur: (subListIdx: number, localIdx: number) => (e: any) => void;
};

function IngredientsSubField({ listIdx, listPos, isPercentagesIncluded, onPercentageBlur, onQuantityBlur }: Props) {
    const { values, setFieldValue } = useFormikContext<RecipieFormData>();
    const namePrefix = `ingredients.lists.${listIdx}`;

    return (
        <div>
            <label htmlFor={`${namePrefix}.name`}>SubFieldName</label>
            <Field name={`${namePrefix}.name`} type="text" />
            <ErrorMessage name={`${namePrefix}.name`} />
            <FieldArray name={`${namePrefix}.ingredients`} render={arrayHelpers =>
                <>
                    {
                        values.ingredients.lists[listIdx].ingredients.map((ingredient, localIdx) => {
                            let percentageField = null;
                            const globalIdx = listPos + localIdx;
                            const ingredientNamePrefix = `${namePrefix}.ingredients.${localIdx}`;
                            if (isPercentagesIncluded) {
                                if (globalIdx === values.ingredients.anchor) {
                                    percentageField = <>anchor</>;
                                }
                                else {
                                    percentageField = (<>
                                        <Field name={`${ingredientNamePrefix}.percentage`}
                                            type="text"
                                            onBlur={onPercentageBlur(listIdx, localIdx)}
                                            placeholder="?"
                                        />
                                        %
                                        <button type="button" onClick={() => setFieldValue('ingredients.anchor', globalIdx)}>set to anchor</button>
                                    </>);
                                }
                            }

                            return (
                                <div key={localIdx}>
                                    <button type="button" onClick={() => arrayHelpers.remove(localIdx)}>
                                        --
                                    </button>

                                    <Field name={`${ingredientNamePrefix}.name`} type="text" />
                                    <Field name={`${ingredientNamePrefix}.quantity`}
                                        type="text"
                                        onBlur={onQuantityBlur(listIdx, localIdx)}
                                    />
                                    <label htmlFor={`${ingredientNamePrefix}.optional`}>Optional?</label>
                                    <Field name={`${ingredientNamePrefix}.optional`} type="checkbox" />
                                    {percentageField}
                                    <br />
                                    <ErrorMessage name={`${ingredientNamePrefix}.name`} /><br />
                                    <ErrorMessage name={`${ingredientNamePrefix}.quantity`} /><br />
                                    <ErrorMessage name={`${ingredientNamePrefix}.percentage`} />
                                </div>
                            );
                        })
                    }
                    < button type="button" onClick={() => arrayHelpers.push({ name: '', quantity: '', optional: false, percentage: '' })}>
                        ++
                    </button >
                </>} />
        </div>
    );
};

export default IngredientsSubField;