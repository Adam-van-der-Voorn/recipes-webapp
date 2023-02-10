import React, { ForwardedRef, forwardRef, Fragment } from "react";

type Props = {
    props?: React.HTMLAttributes<HTMLDivElement>,
    children?: string,
}


function MultiLineParagraph({children, props}: Props, ref: ForwardedRef<HTMLDivElement>) {
    let content;
    if (!children) {
        content = null
    }
    else {
        content = children.split("\n")
            .map((line, i) => <Fragment key={i}>{line}<br /></Fragment>)
    }
    return (
        <p ref={ref}>{content}</p>
    );
}

export default forwardRef(MultiLineParagraph);