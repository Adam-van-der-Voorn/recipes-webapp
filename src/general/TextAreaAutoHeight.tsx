import { forwardRef, HTMLProps, useEffect, useImperativeHandle, useRef, ForwardedRef } from "react";
import extractFields from "../util/extractFields";

type Props = {
    defaultHeight?: number;
    name: string;
} & HTMLProps<HTMLTextAreaElement>;

// works with border-box only
function TextAreaAutoHeight({ defaultHeight = 0, ...props }: Props, ref: ForwardedRef<HTMLTextAreaElement>) {

    const innerRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => innerRef.current!);

    const adjust = () => {
        if (!innerRef.current) {
            console.error("TextAreaAutoHeight: ref is null");
            return;
        }
        // count new lines
        const text = innerRef.current.value;
        let lines = 1;
        for (const char of text) {
            if (char === '\n') {
                lines ++
            }
        }

        const lineHeightStr = getComputedStyle(innerRef.current).lineHeight; // 20px
        const lineHeightPx = parseFloat(lineHeightStr);
        if (lineHeightPx) {
            const adjustedHeight = ((lines * lineHeightPx) + 3);  // why the 3? border adjustment I think
            const final = Math.max(adjustedHeight, defaultHeight);
            innerRef.current.style.height = final + "px"
        }
        else {
            innerRef.current.style.height = defaultHeight + "px"
        }
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