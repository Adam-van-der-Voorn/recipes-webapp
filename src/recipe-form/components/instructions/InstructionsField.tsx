import { Control, useFieldArray, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { useRef, useEffect, useState, useCallback, memo } from "react";
import DragDropList from "../../../components-misc/DragDropList";
import { RecipeFormData, RecipeInputInstruction } from "../RecipeForm";
import Instruction from "./Instruction";
import './InstructionsField.css';
import useListFocuser from "../../useListFocuser";

type FormHelpers = {
    control: Control<RecipeFormData, any>;
    setValue: UseFormSetValue<RecipeFormData>;
    register: UseFormRegister<RecipeFormData>;
}

type Props = { } & FormHelpers;

function InstructionsField({ ...formHelpers }: Props) {
    const { setValue, control, register } = formHelpers;
    const instructionFormProps = { control, register };
    const { fields, remove, insert } = useFieldArray({ control, name: "instructions" });

    const containerRef = useRef<HTMLDivElement>(null);

    const setFocus = useListFocuser(containerRef);

    const [isKeyDown, setIsKeyDown] = useState(false);

    useEffect(() => {
        if (fields.length === 0) {
            setValue(`instructions`, [{ val: '' }]);
        }
    }, [fields, setValue]);

    const handleKeyDown = useCallback((ev: any, idx: number) => {
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
    }, [fields, isKeyDown, setIsKeyDown, setFocus, remove, insert]);

    const handleKeyUp = useCallback((ev: any) => {
        setIsKeyDown(false);
    }, [setIsKeyDown]);

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
                            {...instructionFormProps}
                        />
                    ))}
                </div>
            </DragDropList>
        </>
    );
};

export default memo(InstructionsField);