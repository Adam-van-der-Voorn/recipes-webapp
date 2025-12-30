import { useCallback, useEffect } from "react";

export function usePreventUnload(isDirty: boolean) {
  const preventUnload = useCallback((ev: any) => {
    if (isDirty) {
      ev.preventDefault();
      // we just need a non-empty string, modern browsers display thier own message
      // but just in case...
      return "This page is asking you to confirm that you want to leave — information you've entered may not be saved.";
    }
  }, [isDirty]);

  useEffect(() => {
    window.addEventListener("beforeunload", preventUnload);
    return () => window.removeEventListener("beforeunload", preventUnload);
  }, [preventUnload]);
}
