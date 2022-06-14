import { Draggable } from "react-beautiful-dnd";
import TextAreaAutoHeight from "../../../components-misc/TextAreaAutoHeight";
import FormErrorMessage from "../FormErrorMessage";
import { MdDragHandle } from 'react-icons/md';

type Props = {
    id: string,
    idx: number;
    handleKeyDown: (ev: any, idx: number) => void;
};

export default function Instruction({ id, idx, handleKeyDown }: Props) {
    return (
        <Draggable key={id} draggableId={id} index={idx}>
            {(provided, snapshot) => (
                <div className="instruction"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={provided.draggableProps.style}
                >
                    <label htmlFor={`instructions.${idx}.instruction`} >{idx + 1}.</label>
                    <TextAreaAutoHeight name={`instructions.${idx}.instruction`}
                        onKeyDown={(ev: any) => handleKeyDown(ev, idx)}
                        autoComplete="off"
                    />
                    <div {...provided.dragHandleProps}>
                        <MdDragHandle size={20} className="drag-handle"/>
                    </div>
                    <FormErrorMessage name={`instructions.${idx}.instruction`} />
                </div>
            )}
        </Draggable>
    );
}