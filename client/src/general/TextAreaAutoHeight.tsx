import { forwardRef, HTMLProps, useEffect, useImperativeHandle, useRef, ForwardedRef, useMemo } from "react";
import extractFields from "../util/extractFields";

type Props = {
    name: string;
    lineHeight: number;
    defaultLines?: number;
} & HTMLProps<HTMLTextAreaElement>;

// works with border-box only
function TextAreaAutoHeight({ lineHeight, defaultLines, ...props }: Props, ref: ForwardedRef<HTMLTextAreaElement>) {

    const innerRef = useRef<HTMLTextAreaElement>(null);
    defaultLines = defaultLines && defaultLines >= 1 ? defaultLines : 1

    useImperativeHandle(ref, () => innerRef.current!);

    const adjust = () => {
        const $textArea = innerRef.current;
        if (!$textArea) {
            return;
        }
        // get line height in PX - note that input line height is relative to typeface height
        const lineHeightStr = getComputedStyle($textArea).lineHeight;
        const lineHeightPx = parseFloat(lineHeightStr);

        const defaultHeight = defaultLines * lineHeightPx
        $textArea.style.height = `${defaultHeight}px`;
        
        const scrollHeightPx = $textArea.scrollHeight;
        const scrollHeightToNearestLineHeight = Math.ceil(scrollHeightPx/lineHeightPx) * lineHeightPx
        
        const adjustedHeight = (scrollHeightToNearestLineHeight + 3);  // why the 3? border adjustment I think
        if (adjustedHeight > defaultHeight) {
            $textArea.style.height = adjustedHeight + "px";
        }
        // console.log("adjust ", { lineHeightStr, lineHeightPx, lineHeight, scrollHeightPx, scrollHeightToNearestLineHeight, adjustedHeight, defaultHeight })
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

    const style: React.CSSProperties = useMemo(() => ({
        boxSizing: "border-box",
        overflow: "hidden",
        // line-height must set as a number so we can parse it
        lineHeight: lineHeight,
    }), [lineHeight]);

    return <textarea ref={innerRef}
        {...newProps}
        style={style}
        onChange={combinedOnChange}
    />;
}

export default forwardRef(TextAreaAutoHeight);