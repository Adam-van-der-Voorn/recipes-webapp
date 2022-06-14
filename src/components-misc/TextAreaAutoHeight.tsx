import { useField } from "formik";
import { HTMLProps, useEffect, useRef } from "react";
import extractField from "../util/extractField";

type Props = {
    defaultHeight?: string;
    name: string;
} & HTMLProps<HTMLButtonElement>;

// works with border-box only
export default function TextAreaAutoHeight({ defaultHeight = '0', ...props }: Props) {
    const [field] = useField(props.name);
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