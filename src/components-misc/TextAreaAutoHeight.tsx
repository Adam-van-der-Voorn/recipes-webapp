import { useField } from "formik";
import { useEffect, useRef } from "react";
import extractField from "../util/extractField";

type Props = {
    defaultHeight?: string;
    onEnter?: (ev: any) => void;
    name: string;
    [key: string]: any;
};

// works with border-box only
export default function TextAreaAutoHeight({ defaultHeight = '0', onEnter = undefined, ...props }: Props) {
    const [field] = useField(props);
    const domRef = useRef<HTMLTextAreaElement>(null);

    const adjust = () => {
        if (!domRef.current) {
            console.error("TextAreaAutoHeight: ref is null");
            return;
        }
        domRef.current.style.height = defaultHeight;
        domRef.current.style.height = (domRef.current.scrollHeight + 3) + "px"; // why the 3? border adjustment I think
    };

    const [newProps, propsOnChange] = extractField(props, 'onChange');
    const [newFormikField, formikOnChange] = extractField(field, 'onChange');

    const combinedOnChange = (ev: any) => {
        if (onEnter && ev.nativeEvent.inputType === "insertLineBreak") {
            onEnter(ev)
            return;
        }
        if (propsOnChange) {
            propsOnChange(ev);
        }
        formikOnChange(ev);
        adjust();
    };

    useEffect(() => {
        adjust();
    });

    return <textarea ref={domRef} {...newFormikField} {...newProps} onChange={combinedOnChange} />;
}