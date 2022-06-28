import { useFieldArray, UseFormReturn } from "react-hook-form";
import { useRef, useEffect, useState } from "react";
import DragDropList from "../../../components-misc/DragDropList";
import { RecipeFormData, RecipeInputInstruction } from "../RecipeForm";
import Instruction from "./Instruction";
import './InstructionsField.css';
import useListFocuser from "../../useListFocuser";

type Props = {
    formHelper: UseFormReturn<RecipeFormData>;
};

function InstructionsField({ formHelper }: Props) {
    const { setValue, control } = formHelper;
    const { fields, remove, insert } = useFieldArray({ control, name: "instructions" });

    const containerRef = useRef<HTMLDivElement>(null);

    const setFocus = useListFocuser(containerRef);

    const [isKeyDown, setIsKeyDown] = useState(false);

    useEffect(() => {
        if (fields.length === 0) {
            setValue(`instructions`, [{ val: '' }]);
        }
    }, [fields]);

    const handleKeyDown = (ev: any, idx: number) => {
        if (ev.code === "Enter") {
            ev.preventDefault();
        }

        const shouldRemoveLine = ev.code === "Backspace" && ev.target.value === "" && fields.length > 1;
        const shouldAddLine = ev.code === "Enter" && fields.length < 99;

        if (shouldRemoveLine || shouldAddLine) {
            ev.preventDefault();
            if (isKeyDown) {
                console.log(`InstructionsField: handleKeyDown: [${ev.code}] key 'pressed' but key is already down.`);
                return;
            }
            console.log(`InstructionsField: handleKeyDown: [${ev.code}] key pressed at idx ${idx}`);
            setIsKeyDown(true);
        }

        if (shouldRemoveLine) {
            setFocus(Math.max(0, idx - 1));
            remove(idx);
        }

        else if (shouldAddLine) {
            insert(idx + 1, { val: '' });
            setFocus(idx + 1);
        }
    };

    const handleKeyUp = (ev: any) => {
        setIsKeyDown(false);
    };

    return (
        <>
            <h2>Method</h2>
            <DragDropList data={fields} setData={(newData) => setValue('instructions', newData as RecipeInputInstruction[])}>
                <div className="instructions" ref={containerRef}>
                    {fields.map((field, idx) => (
                        <Instruction key={field.id}
                            id={field.id}
                            idx={idx}
                            handleKeyDown={handleKeyDown}
                            handleKeyUp={handleKeyUp}
                            formHelper={formHelper}
                        />
                    ))}
                </div>
            </DragDropList>
        </>
    );
};

export default InstructionsField;