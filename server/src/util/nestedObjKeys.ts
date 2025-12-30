export function findNestedObjKey(
  obj: Record<string, unknown>,
  pred: (o: Record<string, unknown>) => boolean,
): Record<string, unknown> | null {
  const stack: any[] = [obj];
  while (stack?.length > 0) {
    const currentObj = stack.pop()!;
    if (pred(currentObj)) {
      return currentObj;
    }
    Object.keys(currentObj).forEach((key) => {
      const value = currentObj[key];
      if (value !== null && typeof value === "object") {
        stack.push(value);
      }
    });
  }
  return null;
}
