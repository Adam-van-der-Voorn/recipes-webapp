import { ForwardedRef, forwardRef } from "react";
import { MdAnchor } from "react-icons/md";
import style from '../RecipeForm.module.css';

type Props = {
    isAnchor: boolean;
    [key: string]: any;
}

function PercentageInput({ isAnchor, ...props}: Props, ref: ForwardedRef<HTMLInputElement>) {
    if (isAnchor) {
        return <div className={style.percentageInput}><MdAnchor /></div>
    }

    return (
        <div className={style.percentageInput}>
            <input {...props} ref={ref}
                type="text"
                placeholder="?"
                autoComplete="off"
                aria-label="ingredient quantity as a percentage of the anchor"
            />
            <span className={style.percentInputSymbol}>%</span>
        </div>
    )
}

export default forwardRef(PercentageInput)