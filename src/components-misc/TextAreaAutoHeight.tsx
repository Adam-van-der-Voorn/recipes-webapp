import { useField } from "formik";
import { useEffect, useRef } from "react";
import { RecipieFormData } from "../recipie-form/components/RecipieForm";

type Props = {
    defaultHeight: string;
    name: string;
    [key: string]: any;
};


// works with border-box only
export default function TextAreaAutoHeight({ defaultHeight, ...props }: Props) {
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

    // messy - rip out the onChange function from the props and formik methods
    const formikOnChange = field.onChange;
    const formikField: any = field as any;
    delete formikField.onChange;
    const propsOnChange = props.onChange;
    delete props.onChange;

    const combinedOnChange = (ev: any) => {
        if (propsOnChange) {
            propsOnChange(ev);
        }
        formikOnChange(ev);
        adjust();
    };

    useEffect(() => {
        adjust();
    })

    return <textarea ref={domRef} {...formikField} {...props} onChange={combinedOnChange}/>;
}