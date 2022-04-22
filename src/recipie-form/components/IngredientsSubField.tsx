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

    return (
        <div>
            <label htmlFor={`ingredients.lists.${listIdx}.name`}>SubFieldName</label>
            <Field name={`ingredients.lists.${listIdx}.name`} type="text" />
            <ErrorMessage name={`ingredients.lists.${listIdx}.name`} />
            <FieldArray name={`ingredients.lists.${listIdx}.ingredients`} render={arrayHelpers =>
                <>
                    {
                        values.ingredients.lists[listIdx].ingredients.map((ingredient, localIdx) => {
                            let percentageField = null;
                            const globalIdx = listPos + localIdx;
                            if (isPercentagesIncluded) {
                                if (globalIdx === values.ingredients.anchor) {
                                    percentageField = <>anchor</>;
                                }
                                else {
                                    percentageField = (<>
                                        <Field name={`ingredients.lists.${listIdx}.ingredients.${localIdx}.percentage`}
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
                                <div key={ingredient.name + localIdx}>
                                    <button type="button" onClick={() => arrayHelpers.remove(localIdx)}>
                                        --
                                    </button>

                                    <Field name={`ingredients.lists.${listIdx}.ingredients.${localIdx}.name`} type="text" />
                                    <Field name={`ingredients.lists.${listIdx}.ingredients.${localIdx}.quantity`}
                                        type="text"
                                        onBlur={onQuantityBlur(listIdx, localIdx)}
                                    />
                                    {percentageField}
                                    <br />
                                    <ErrorMessage name={`ingredients.lists.${listIdx}.ingredients.${localIdx}.name`} /><br />
                                    <ErrorMessage name={`ingredients.lists.${listIdx}.ingredients.${localIdx}.quantity`} /><br />
                                    <ErrorMessage name={`ingredients.lists.${listIdx}.ingredients.${localIdx}.percentage`} />
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