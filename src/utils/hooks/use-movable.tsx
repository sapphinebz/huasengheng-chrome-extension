import * as React from "react";
import useObservableRef from "./use-observable-ref";
import { EMPTY, switchMap } from "rxjs";
import { makeItMovable } from "@utils/make-it-movable";

export default function useMovable<T extends HTMLElement>() {
  const [containerRef, elementChanged] = useObservableRef<T>();

  React.useEffect(() => {
    const subscription = elementChanged
      .pipe(
        switchMap((el) => {
          if (el) {
            return makeItMovable(el);
          }
          return EMPTY;
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [elementChanged]);

  return containerRef;
}
