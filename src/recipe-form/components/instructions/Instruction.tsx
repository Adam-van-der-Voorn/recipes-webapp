import { Draggable } from "react-beautiful-dnd";
import TextAreaAutoHeight from "../../../components-misc/TextAreaAutoHeight";
import FormErrorMessage from "../FormErrorMessage";
import { MdDragHandle } from 'react-icons/md'

type Props = {
    id: string,
    idx: number;
    handleEnter: (idx: number) => void;
    handleKeyDown: (ev: any, idx: number) => void;
}

export default function Instruction({id, idx, handleEnter, handleKeyDown}: Props) {
    return (
        <Draggable key={id} draggableId={id} index={idx}>
            {(provided, snapshot) => (
                <div className="field-container inline"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={provided.draggableProps.style}
                >
                    <label htmlFor={`instructions.${idx}.instruction`} {...provided.dragHandleProps}>[...] {idx + 1}.</label>
                    <TextAreaAutoHeight name={`instructions.${idx}.instruction`}
                        className="instruction"
                        onEnter={() => handleEnter(idx)}
                        onKeyDown={(ev: any) => handleKeyDown(ev, idx)}
                        autoComplete="off"
                    />
                    <FormErrorMessage name={`instructions.${idx}.instruction`} />
                </div>
            )}
        </Draggable>
    );
}