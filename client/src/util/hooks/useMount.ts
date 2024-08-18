import { useRef } from "react";

/**
 * calls a function once per mount, BEFORE the component renders
 * */ 
export default function useMount(f: () => void): void {
    const called = useRef(false);
    if (!called.current) {
        f();
        called.current = true;
    }
}