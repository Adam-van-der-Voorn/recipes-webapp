import { useRef, useEffect, RefObject, useCallback } from "react";


// arbitrary negative value
const NO_FOCUS = -2;

function useListFocuser(containerRef: RefObject<HTMLElement>) {
    const nextInFocus = useRef<number>(NO_FOCUS);

    useEffect(() => {
        if (nextInFocus.current !== NO_FOCUS) {
            if (!containerRef.current) {
                console.warn(`useListFocuser: containerRef is ${containerRef.current}. Aborting focus change.`)
                nextInFocus.current = NO_FOCUS;
                return;
            }

            const line = containerRef.current.children.item(nextInFocus.current);
            if (!line) {
                console.error(`useListFocuser: no item found in index ${nextInFocus.current}. Aborting focus change.`)
                nextInFocus.current = NO_FOCUS;
                return;
            }

            const input = line.querySelector<HTMLTextAreaElement>('textarea');
            if (!input) {
                console.error(`useListFocuser: no textarea found in line:`, line);
                nextInFocus.current = NO_FOCUS;
                return;
            }
            input.focus();
            nextInFocus.current = NO_FOCUS;
        }
    });

    const setFocus = useCallback((idx: number) => nextInFocus.current = idx, [nextInFocus]);
    
    return setFocus;
}

export default useListFocuser;