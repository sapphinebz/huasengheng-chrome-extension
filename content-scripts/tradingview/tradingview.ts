import {
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  fromEvent,
  merge,
  pipe,
} from "rxjs";
import {
  connect,
  distinctUntilChanged,
  filter,
  map,
  scan,
  switchMap,
  tap,
} from "rxjs/operators";
import { watchContentChanges } from "../utils/watch-content-changes";
import { watchUntilExist } from "../utils/watch-until-exist";

watchUntilExist(500, () =>
  document.querySelector<HTMLDivElement>("[data-status]")
)
  .pipe(
    switchMap((statusBarEl) => {
      return fromEvent<MouseEvent>(document, "mousemove").pipe(
        connect((mousemove$) => {
          const valuesEl = statusBarEl.childNodes[1];
          const baseEl = valuesEl.firstChild as HTMLElement;

          const template = document.createElement("template");
          template.innerHTML = `
          <div class="valueItem-l31H9iuA unimportant-l31H9iuA">
          <div class="valueTitle-l31H9iuA">H-L</div>
          <div class="valueValue-l31H9iuA" data-value style="color: rgb(8, 153, 129)">
            0
          </div>
          <div class="valueTitle-l31H9iuA">/1บาท</div>
        </div>
            `;

          const node = document.importNode(template.content, true);
          const highMinusLowEl =
            node.querySelector<HTMLElement>("[data-value]");
          baseEl.appendChild(node);

          const marketOpenning$ = mousemove$.pipe(
            bahtWeigtPriceByChildNTH(baseEl, 1)
          );

          const high$ = mousemove$.pipe(bahtWeigtPriceByChildNTH(baseEl, 2));
          const low$ = mousemove$.pipe(bahtWeigtPriceByChildNTH(baseEl, 3));
          const close$ = mousemove$.pipe(bahtWeigtPriceByChildNTH(baseEl, 4));

          return merge(marketOpenning$, high$, low$, close$).pipe(
            scan((state, incoming) => ({ ...state, ...incoming }), {}),
            tap((state) => {
              if (highMinusLowEl) {
                highMinusLowEl.innerText = `${state["H"] - state["L"]}`;
              }
            })
          );
        })
      );
    })
  )
  .subscribe();

function bahtWeigtPriceByChildNTH(
  baseEl: HTMLElement,
  nth: number
): OperatorFunction<MouseEvent, { [key: string]: number }> {
  return pipe(
    map(() => {
      const openCandleEl = baseEl.children[nth].children[1] as HTMLElement;
      return Number(openCandleEl.innerText);
    }),
    ozToBahtPrice(),
    map((bahtW) => ({
      [(baseEl.children[nth].children[0] as HTMLElement).innerText]: bahtW,
    }))
  );
}

function ozToBahtPrice(): MonoTypeOperatorFunction<number> {
  return pipe(
    filter((num) => !isNaN(num)),
    distinctUntilChanged(),
    map((oz) => oz / 2.04)
  );
}
