import { ForwardedRef, forwardRef } from "react";
import { MdAnchor } from "react-icons/md";

type Props = {
    isAnchor: boolean;
    [key: string]: any;
}

function PercentageInput({ isAnchor, ...props}: Props, ref: ForwardedRef<HTMLInputElement>) {
    if (isAnchor) {
        return <div className="anchor"><MdAnchor /></div>
    }

    return (
        <div className="percentage">
            <input {...props} ref={ref}
                type="text"
                placeholder="?"
                autoComplete="off"
            />
            %
        </div>
    )
}

export default forwardRef(PercentageInput)