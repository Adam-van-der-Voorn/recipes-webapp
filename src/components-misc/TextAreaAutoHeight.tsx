import { forwardRef, HTMLProps, useEffect, useImperativeHandle, useRef, ForwardedRef } from "react";
import extractFields from "../util/extractFields";

type Props = {
    defaultHeight?: string;
    name: string;
} & HTMLProps<HTMLTextAreaElement>;

// works with border-box only
function TextAreaAutoHeight({ defaultHeight = '0', ...props }: Props, ref: ForwardedRef<HTMLTextAreaElement>) {

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

    const [newProps, propsOnChange] = extractFields(props, 'onChange');

    const combinedOnChange = (ev: any) => {
        if (propsOnChange) {
            propsOnChange(ev);
        }
        adjust();
    };

    useEffect(() => {
        adjust();
    });

    return <textarea ref={innerRef}
        {...newProps}
        style={{ overflow: "hidden" }}
        onChange={combinedOnChange}
    />;
}

export default forwardRef(TextAreaAutoHeight);