import { Control, UseFormRegister, UseFormSetValue, useWatch } from "react-hook-form";
import { useRef, useEffect, useState, useCallback, memo } from "react";
import DragDropList from "../../../components-misc/DragDropList";
import Instruction from "./Instruction";
import './InstructionsField.css';
import useListFocuser from "../../useListFocuser";
import { RecipeInput } from "../../../types/RecipeInputTypes";
import useFieldList from "../../../util/hooks/useFieldList";
import { v4 as uuid4 } from 'uuid';

type FormHelpers = {
    control: Control<RecipeInput, any>;
    setValue: UseFormSetValue<RecipeInput>;
    register: UseFormRegister<RecipeInput>;
}

type Props = { } & FormHelpers;

function InstructionsField({ setValue, control, register }: Props) {
    const instructions = useWatch({control, name: "instructions"});
    const { remove, insert, replace } = useFieldList("instructions", setValue, instructions);

    const containerRef = useRef<HTMLDivElement>(null);

    const setFocus = useListFocuser(containerRef);

    const [isKeyDown, setIsKeyDown] = useState(false);

    useEffect(() => {
        if (instructions.length === 0) {
            replace([{ id: uuid4(), val: '' }]);
        }
    }, [instructions, replace]);

    const handleKeyDown = useCallback((ev: any, idx: number) => {
        if (ev.code === "Enter") {
            ev.preventDefault();
        }

        const shouldRemoveLine = ev.code === "Backspace" && ev.target.value === "" && instructions.length > 1;
        const shouldAddLine = ev.code === "Enter" && instructions.length < 99;

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
            insert(idx + 1, { id: uuid4(), val: '' });
            setFocus(idx + 1);
        }
    }, [instructions, isKeyDown, setIsKeyDown, setFocus, remove, insert]);

    const handleKeyUp = useCallback((ev: any) => {
        setIsKeyDown(false);
    }, [setIsKeyDown]);

    return (
        <>
            <h2>Method</h2>
            <DragDropList data={instructions} setData={(newData) => replace(newData as any)}>
                <div className="instructions" ref={containerRef}>
                    {instructions.map((instruction, idx) => (
                        <Instruction key={instruction.id}
                            id={instruction.id}
                            idx={idx}
                            handleKeyDown={handleKeyDown}
                            handleKeyUp={handleKeyUp}
                            {...{register, control}}
                        />
                    ))}
                </div>
            </DragDropList>
        </>
    );
};

export default memo(InstructionsField);