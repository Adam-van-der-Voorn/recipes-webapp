import { forwardRef, HTMLProps, useEffect, useImperativeHandle, useRef } from "react";
import extractField from "../util/extractField";

type Props = {
    defaultHeight?: string;
    name: string;
} & HTMLProps<HTMLButtonElement>;

// works with border-box only
const TextAreaAutoHeight = forwardRef<HTMLTextAreaElement, Props>(({ defaultHeight = '0', ...props }, ref) => {

    const innerRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => innerRef.current!);

    const adjust = () => {
        if (!innerRef.current) {
            console.error("TextAreaAutoHeight: ref is null");
            return;
        }
        innerRef.current.style.height = defaultHeight;
        innerRef.current.style.height = (innerRef.current.scrollHeight + 3) + "px"; // why the 3? border adjustment I think
    };

    const [newProps, propsOnChange] = extractField(props, 'onChange');

    const combinedOnChange = (ev: any) => {
        if (propsOnChange) {
            propsOnChange(ev);
        }
        adjust();
    };

    useEffect(() => {
        adjust();
    });

    return <textarea ref={innerRef} {...newProps} onChange={combinedOnChange} />;
});

export default TextAreaAutoHeight;