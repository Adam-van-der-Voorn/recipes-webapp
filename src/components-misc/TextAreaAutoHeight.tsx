import { forwardRef, HTMLProps, useEffect, useImperativeHandle, useRef } from "react";
import extractFields from "../util/extractFields";
import cx from 'classnames';
import './TextAreaAutoHeight.css'

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

    const [newProps, propsOnChange, propsClassName] = extractFields(props, 'onChange', 'className');

    const combinedOnChange = (ev: any) => {
        if (propsOnChange) {
            propsOnChange(ev);
        }
        adjust();
    };

    const className = cx(propsClassName, 'auto-height')

    useEffect(() => {
        adjust();
    });

    return <textarea ref={innerRef} {...newProps} className={className} onChange={combinedOnChange} />;
});

export default TextAreaAutoHeight;