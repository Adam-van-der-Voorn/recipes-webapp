import React, { ForwardedRef, forwardRef } from "react";
import './IconButton.css'

export default forwardRef((props: any, ref: ForwardedRef<HTMLDivElement>) => {
    const { icon, size } = props;
    const iconProps = { ...props };
    iconProps.icon = undefined;

    console.assert(icon, "IconButton: no icon passed as prop");
    console.assert(size, "IconButton: no size passed as prop");

    const existingClasses = iconProps.className || '';
    iconProps.className = existingClasses + ' icon-button';

    return (
        <div className="icon-button-container" ref={ref} style={{ width: size, height: size}}>
            {icon(iconProps)}
        </div>
    );
});
