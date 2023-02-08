import React, { ForwardedRef, forwardRef } from "react";

type Props = {
    props?: React.HTMLAttributes<HTMLDivElement>,
    children?: string,
}


function MultiLineParagraph({children, props}: Props, ref: ForwardedRef<HTMLDivElement>) {
    children = children || ""
    const lines = children.split("\n")
        .map(line => <>{line}<br /></>)

    return (
        <p ref={ref}>{lines}</p>
    );
}

export default forwardRef(MultiLineParagraph);