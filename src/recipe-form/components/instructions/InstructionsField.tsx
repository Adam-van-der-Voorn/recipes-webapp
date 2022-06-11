import { useFormikContext, FieldArrayRenderProps } from "formik";
import React, { useRef, useEffect } from "react";
import TextAreaAutoHeight from "../../../components-misc/TextAreaAutoHeight";
import FormErrorMessage from "../FormErrorMessage";
import { RecipeFormData } from "../RecipeForm";
import './InstructionsField.css';

type Props = {
    arrayHelpers: FieldArrayRenderProps;
};

// arbitrary negative value
const NO_FOCUS = -2;

function InstructionsField({ arrayHelpers }: Props) {
    const { values, setFieldValue } = useFormikContext<RecipeFormData>();
    const containerRef = useRef<HTMLDivElement>(null);
    const nextInFocus = useRef<number>(NO_FOCUS);
    const instructions = values.instructions;

    useEffect(() => {
        if (instructions.length === 0) {
            setFieldValue(`instructions`, ['']);
        }
    }, [values.instructions]);

    useEffect(() => {
        if (nextInFocus.current !== NO_FOCUS) {
            const line = containerRef.current?.children.item(nextInFocus.current)!;
            const input = line.querySelector<HTMLTextAreaElement>('textarea');
            input!.focus();
            nextInFocus.current = NO_FOCUS;
        }
    }, [nextInFocus.current]);

    const handleEnter = (idx: number) => {
        arrayHelpers.insert(idx + 1, '');
        nextInFocus.current = idx + 1;
        return;
    };

    const handleKeyDown = (ev: any, idx: number) => {
        if (ev.code === "Backspace" && ev.target.value === "") {
            if (instructions.length > 1) {
                nextInFocus.current = Math.max(0, idx - 1);
                arrayHelpers.remove(idx);
            }
        }
    };

    return (
        <>
            <h2>Method</h2>
            <div className="instructions" ref={containerRef}>
                {values.instructions.map((instruction, idx) => (
                    <div key={idx} className="field-container inline">
                        <label htmlFor={`instructions.${idx}`}>{idx + 1}.</label>
                        <TextAreaAutoHeight name={`instructions.${idx}`}
                            className="instruction"
                            onEnter={() => handleEnter(idx)}
                            onKeyDown={(ev: any) => handleKeyDown(ev, idx)}
                            autoComplete="off"
                        />
                        <FormErrorMessage name={`instructions.${idx}`} />
                    </div>
                ))}
            </div>
        </>
    );
};

export default InstructionsField;