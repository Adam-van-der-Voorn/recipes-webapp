import { useField } from "formik";
import { useRef, useState } from "react";
import './AdjustableTextInput.css';

type Props = {
    defaultWidth: string;
    name: string;
    [key: string]: any;
};

function AdjustableTextInput({ defaultWidth, ...props }: Props) {
    const [field] = useField(props);
    const [width, setWidth] = useState(defaultWidth);
    const inputRef = useRef<HTMLInputElement>(null);

    const adjust = (): void => {
        // https://stackoverflow.com/questions/8100770/auto-scaling-inputtype-text-to-width-of-value
        // via Joseph Nields
        if (inputRef.current === null) {
            console.error("AdjustableTextInput: input ref is null");
            return;
        }

        // reset to default size (for if text deleted) 
        inputRef.current.style.width = `min(${defaultWidth}, 100%)`;
        // getting the scrollWidth should trigger a reflow
        // and give you what the width would be in px if 
        // original style, less any box-sizing
        const newWidth = inputRef.current.scrollWidth;
        setWidth(newWidth + "px");
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

    return (
        <input type="text"
            ref={inputRef}
            className={(`adjustable ${props.className || ''}`).trim()}
            onChange={combinedOnChange}
            style={{ width: `min(${width}, 100%)` }}
            {...formikField}
            {...props}
        />
    );
};

export default AdjustableTextInput;