import React, { ForwardedRef, forwardRef } from "react";
import { IconType } from "react-icons/lib";
import './IconButton.css';

type Props = {
    icon: IconType;
    size: number;
    [key: string]: any;
};

function IconButton({icon, size, ...props}: Props, ref: ForwardedRef<HTMLDivElement>) {
    const existingClasses = props.className || '';
    const className = (existingClasses + ' icon-button').trim();

    return (
        <div className="icon-button-container" ref={ref} style={{ width: size, height: size }}>
            {icon({size, ...props, className})}
        </div>
    );
}

export default forwardRef(IconButton);