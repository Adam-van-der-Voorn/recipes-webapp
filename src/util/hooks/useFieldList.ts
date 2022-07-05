import { useCallback } from "react";
import { UseFormSetValue } from "react-hook-form";

export default function useFieldList<Base, Nested>(listName: string, setValue: UseFormSetValue<Base>, data: any[]) {
    const push = useCallback((val: Nested) => {
        setValue(listName as any, [...data, val] as any)
    }, [setValue, listName, data])

    const remove = useCallback((idx: number) => {
        setValue(listName as any, [...data.slice(0, idx), ...data.slice(idx + 1)] as any)
    }, [setValue, listName, data])

    const replace = useCallback((val: Nested) => {
        setValue(listName as any, val as any)
    }, [setValue, listName])

    const insert = useCallback((idx: number, val: Nested, ) => {
        setValue(listName as any, [...data.slice(0, idx), val, ...data.slice(idx)] as any)
    }, [setValue, listName, data])

    return { push, remove, replace, insert }
}