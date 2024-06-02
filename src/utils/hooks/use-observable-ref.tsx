import * as React from "react";
import { ReplaySubject } from "rxjs";

export default function useObservableRef<T extends Element>() {
  const [replayRef] = React.useState(() => new ReplaySubject<T | null>(1));
  const setRef = React.useCallback((tValue: T) => {
    replayRef.next(tValue);
  }, []);

  const memolize = React.useMemo(
    () => [setRef, replayRef.asObservable()] as const,
    []
  );

  return memolize;
}
