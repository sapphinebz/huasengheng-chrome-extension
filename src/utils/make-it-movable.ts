import { exhaustMap, fromEvent } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

export function makeItMovable<ELEMENT extends HTMLElement>(el: ELEMENT) {
  const mousedown$ = fromEvent<MouseEvent>(el, "mousedown");
  const mouseup$ = fromEvent<MouseEvent>(document, "mouseup");
  const mousemove$ = fromEvent<MouseEvent>(document, "mousemove");
  el.style.cursor = "grab";

  return mousedown$.pipe(
    exhaustMap((downEvent) => {
      const computedStyle = getComputedStyle(el);
      const oldTop = Number(computedStyle.top.replace("px", ""));
      const oldLeft = Number(computedStyle.left.replace("px", ""));
      return mousemove$.pipe(
        tap((moveEvent) => {
          const dx = moveEvent.x - downEvent.x;
          const dy = moveEvent.y - downEvent.y;
          el.style.top = `${dy + oldTop}px`;
          el.style.left = `${dx + oldLeft}px`;
        }),
        takeUntil(mouseup$)
      );
    })
  );
}
