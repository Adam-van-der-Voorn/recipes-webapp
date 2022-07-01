import { Draggable } from "react-beautiful-dnd";
import TextAreaAutoHeight from "../../../components-misc/TextAreaAutoHeight";
import FormErrorMessage from "../FormErrorMessage";
import { MdDragHandle } from 'react-icons/md';
import { Control, UseFormRegister, useFormState } from "react-hook-form";
import { memo } from "react";
import { RecipeInput } from "../../../types/RecipeInputTypes";

type FormHelpers = {
    control: Control<RecipeInput, any>;
    register: UseFormRegister<RecipeInput>;
}

type Props = {
    id: string,
    idx: number;
    handleKeyDown: (ev: any, idx: number) => void;
    handleKeyUp: (ev: any) => void;
} & FormHelpers;

function Instruction({ id, idx, handleKeyDown, handleKeyUp, ...formHelpers }: Props) {
    const { register, control } = formHelpers;
    const { errors } = useFormState({ control, name: `instructions`, exact: true});
    return (
        <Draggable draggableId={id} index={idx}>
            {(provided, snapshot) => (
                <div className="instruction"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={provided.draggableProps.style}
                >
                    <label htmlFor={`instructions.${idx}.val`} >{idx + 1}.</label>
                    <TextAreaAutoHeight {...register(`instructions.${idx}.val`)}
                        onKeyDown={(ev: any) => handleKeyDown(ev, idx)}
                        onKeyUp={handleKeyUp}
                        autoComplete="off"
                    />
                    <div {...provided.dragHandleProps}>
                        <MdDragHandle size={20} className="drag-handle"/>
                    </div>
                    <FormErrorMessage error={errors.instructions?.at(idx)?.val} />
                </div>
            )}
        </Draggable>
    );
}

export default memo(Instruction)