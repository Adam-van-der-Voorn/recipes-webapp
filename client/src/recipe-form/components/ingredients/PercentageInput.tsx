import { ForwardedRef, forwardRef } from "react";
import { MdAnchor } from "react-icons/md";

type Props = {
  isAnchor: boolean;
  [key: string]: any;
};

function PercentageInput(
  { isAnchor, ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  if (isAnchor) {
    return (
      <div className="percentageInput">
        <MdAnchor />
      </div>
    );
  }

  return (
    <div className="percentageInput">
      <input
        {...props}
        ref={ref}
        type="text"
        placeholder="?"
        autoComplete="off"
        aria-label="ingredient quantity as a percentage of the anchor"
      />
      <span className="percentInputSymbol">%</span>
    </div>
  );
}

export default forwardRef(PercentageInput);
