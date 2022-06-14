import { useFormikContext, FieldArrayRenderProps } from "formik";
import { useRef, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DragDropList from "../../../components-misc/DragDropList";
import { RecipeFormData } from "../RecipeForm";
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

    const [isKeyDown, setIsKeyDown] = useState(false);

    useEffect(() => {
        if (instructions.length === 0) {
            setFieldValue(`instructions`, [newIngredient()]);
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

    const handleKeyDown = (ev: any, idx: number) => {
        const shouldRemoveLine = ev.code === "Backspace" && ev.target.value === "" && instructions.length > 1;
        const shouldAddLine = ev.code === "Enter";

        if (shouldRemoveLine || shouldAddLine) {
            ev.preventDefault();
            if (isKeyDown) {
                return;
            }
            setIsKeyDown(true);
        }

        if (shouldRemoveLine) {
            nextInFocus.current = Math.max(0, idx - 1);
            arrayHelpers.remove(idx);
        }

        else if (shouldAddLine) {
            arrayHelpers.insert(idx + 1, newIngredient());
            nextInFocus.current = idx + 1;
        }
    };

    const handleKeyUp = (ev: any) => {
        setIsKeyDown(false)
    }

    return (
        <>
            <h2>Method</h2>
            <DragDropList data={values.instructions} setData={(newData) => setFieldValue('instructions', newData)}>
                <div className="instructions" ref={containerRef}>
                    {values.instructions.map((instruction, idx) => (
                        <Instruction key={instruction.id}
                            id={instruction.id}
                            idx={idx}
                            handleKeyDown={handleKeyDown}
                            handleKeyUp={handleKeyUp}
                        />
                    ))}
                </div>
            </DragDropList>
        </>
    );
};

export default InstructionsField;