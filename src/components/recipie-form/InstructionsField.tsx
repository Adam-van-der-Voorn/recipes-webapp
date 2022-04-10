import { useFormikContext, ErrorMessage, Field, FieldArrayRenderProps } from "formik";
import { useEffect, useState } from "react";
import parseUnitValInputs from "./parseUnitValInputs";
import { RecipieFormData } from "./RecipieForm";
import convert, { Unit } from 'convert-units';
import { UnitVal } from "../../types/recipieTypes";
import { isConvertableUnit, isSameMeasure } from "../../util/units";

type Props = {
    arrayHelpers: FieldArrayRenderProps;
};

function InstructionsField({ arrayHelpers }: Props) {
    const { values } = useFormikContext<RecipieFormData>();

    return (
        <div>
            <p>Method</p>
            {
                values.instructions.map((instruction, index) => (
                    <div key={index}>
                        <button type="button" onClick={() => arrayHelpers.remove(index)}>
                            -
                        </button>
                        {`${index + 1}. `}
                        <Field name={`instructions.${index}`} as="textarea" /><br />
                        <ErrorMessage name={`instructions.${index}`} /><br />
                    </div>
                ))
            }
            <button type="button" onClick={() => arrayHelpers.push('')}>
                +
            </button >
        </div >
    );
};

export default InstructionsField;