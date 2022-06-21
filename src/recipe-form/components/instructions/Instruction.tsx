import { Draggable } from "react-beautiful-dnd";
import TextAreaAutoHeight from "../../../components-misc/TextAreaAutoHeight";
import FormErrorMessage from "../FormErrorMessage";
import { MdDragHandle } from 'react-icons/md';
import { UseFormReturn } from "react-hook-form";
import { RecipeFormData } from "../RecipeForm";
import { memo } from "react";

type Props = {
    id: string,
    idx: number;
    handleKeyDown: (ev: any, idx: number) => void;
    handleKeyUp: (ev: any) => void;
    formHelper: UseFormReturn<RecipeFormData>;
};

function Instruction({ id, idx, handleKeyDown, handleKeyUp, formHelper }: Props) {
    const { register } = formHelper;
    return (
        <Draggable key={id} draggableId={id} index={idx}>
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
                    {/* <FormErrorMessage name={`instructions.${idx}.instruction`} /> */}
                </div>
            )}
        </Draggable>
    );
}

export default memo(Instruction)