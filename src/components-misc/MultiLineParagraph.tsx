import React, { ForwardedRef, forwardRef } from "react";

type Props = {
    props?: React.HTMLAttributes<HTMLDivElement>,
    children?: string,
}

/**
 * Convert string with newlines to list elements
 */
function StrList({children, props}: Props, ref: ForwardedRef<HTMLOListElement>) {
    let content;
    if (!children) {
        content = null
    }
    else {
        content = children.split("\n")
            .map((line, i) => <li key={i}>{line}</li>)
    }
    return (
        <ol ref={ref}>{content}</ol>
    );
}

export default forwardRef(StrList);