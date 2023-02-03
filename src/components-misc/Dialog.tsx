import { forwardRef, HTMLProps, useImperativeHandle, useRef, ForwardedRef, useEffect } from "react";
import ValidChild from "../types/ValidChild";
import isWithinBounds from "../util/isWithinBounds";
import './TextAreaAutoHeight.css';

type Props = {
    closeOnBackgroudClick?: boolean;
    keepMounted?: boolean;
    onClose: () => void;
    children?: ValidChild | ValidChild[];
} & HTMLProps<HTMLDialogElement>;

function Dialog({ closeOnBackgroudClick = false, keepMounted = false, onClose, children, ...props }: Props, ref: ForwardedRef<HTMLDialogElement>) {
    const innerRef = useRef<HTMLDialogElement>(null);
    useImperativeHandle(ref, () => innerRef.current!);

    const handleClick = (e: any) => {
        if (!closeOnBackgroudClick || !props.open || !innerRef.current || innerRef.current.tagName !== 'DIALOG') {
            // tagname != DIALOG stuff allegedly prevents issues with forms
            return;
        }

        const dialogRect = innerRef.current.getBoundingClientRect();
        const clickedInDialog = isWithinBounds(e.clientX, e.clientY, dialogRect);

        if (!clickedInDialog) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClick);
        return function cleanup() {
            document.removeEventListener('click', handleClick);
        };
    });

    return (
        <dialog ref={innerRef} {...props}>
            {(keepMounted && children) || (props.open && children)}
        </dialog>
    );
}

export default forwardRef(Dialog);