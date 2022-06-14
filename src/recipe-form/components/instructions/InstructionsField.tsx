import { useFormikContext, FieldArrayRenderProps } from "formik";
import React, { useRef, useEffect } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import DragDropList from "../../../components-misc/DragDropList";
import TextAreaAutoHeight from "../../../components-misc/TextAreaAutoHeight";
import FormErrorMessage from "../FormErrorMessage";
import { RecipeFormData, RecipeInputInstruction } from "../RecipeForm";
import Instruction from "./Instruction";
import './InstructionsField.css';

const newIngredient = () => ({ id: uuidv4(), instruction: '' });
// arbitrary negative value
const NO_FOCUS = -2;

type Props = {
    arrayHelpers: FieldArrayRenderProps;
};

function InstructionsField({ arrayHelpers }: Props) {
    const { values, setFieldValue } = useFormikContext<RecipeFormData>();
    const containerRef = useRef<HTMLDivElement>(null);
    const nextInFocus = useRef<number>(NO_FOCUS);
    const instructions = values.instructions;

    useEffect(() => {
        if (instructions.length === 0) {
            setFieldValue(`instructions`, [newIngredient()]);
        }
        console.log(instructions);
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
        arrayHelpers.insert(idx + 1, newIngredient());
        nextInFocus.current = idx + 1;
        return;
    };

    const handleKeyDown = (ev: any, idx: number) => {
        if (ev.code === "Backspace" && ev.target.value === "") {
            if (instructions.length > 1) {
                nextInFocus.current = Math.max(0, idx - 1);
                arrayHelpers.remove(idx);
                ev.preventDefault();
            }
        }
    };

    return (
        <>
            <h2>Method</h2>
            <DragDropList data={values.instructions} setData={(newData) => setFieldValue('instructions', newData)}>
                <div className="instructions" ref={containerRef}>
                    {values.instructions.map((instruction, idx) => (
                        <Instruction key={instruction.id}
                            id={instruction.id}
                            idx={idx}
                            handleEnter={handleEnter}
                            handleKeyDown={handleKeyDown}
                        />
                    ))}
                </div>
            </DragDropList>
        </>
    );
};

export default InstructionsField;