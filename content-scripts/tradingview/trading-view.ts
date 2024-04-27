import { distinctUntilChanged, filter, map, share, tap } from "rxjs/operators";
import { displayHuasenghengBuySell } from "../huasengheng/display-huasengheng-buy-sell";
import { displayTranscation } from "../huasengheng/display-transaction";

import { fromSWMessage } from "../utils/from-sw-message";
import { filterTransactions } from "../utils/filter-transactions";
import { distinctTransactions } from "../utils/distinct-transactions";
import { consoleTableTransactionChanges } from "../utils/console-table-transaction-changes";
import { filterBadgeText } from "../utils/filter-badge-text";
console.log("trading-view ready");

const serviceWorkerMSG$ = fromSWMessage({
  keepAliveEvery: 10000,
}).pipe(share());

const transactionChange$ = serviceWorkerMSG$.pipe(
  filterTransactions(),
  distinctTransactions(),
  consoleTableTransactionChanges(),
  share()
);

serviceWorkerMSG$.pipe(filterBadgeText()).subscribe((event) => {
  const nodeAll = document.querySelectorAll<HTMLElement>(
    ".chrome-hua-fixed, .chrome-fixed"
  );
  for (const node of nodeAll) {
    if (event.badgeText === "ON") {
      node.classList.remove("chrome-hide");
    } else {
      node.classList.add("chrome-hide");
    }
  }
});

transactionChange$
  .pipe(
    map((changes) => changes.transactions),
    displayTranscation()
  )
  .subscribe();

transactionChange$.pipe(displayHuasenghengBuySell()).subscribe();

// watchUntilExist(500, () =>
//   document.querySelector<HTMLDivElement>("[data-status]")
// )
//   .pipe(
//     switchMap((statusBarEl) => {
//       return fromEvent<MouseEvent>(document, "mousemove").pipe(
//         connect((mousemove$) => {
//           const valuesEl = statusBarEl.childNodes[1];
//           const baseEl = valuesEl.firstChild as HTMLElement;

//           const template = document.createElement("template");
//           template.innerHTML = `
//           <div class="valueItem-l31H9iuA unimportant-l31H9iuA">
//           <div class="valueTitle-l31H9iuA">H-L</div>
//           <div class="valueValue-l31H9iuA" data-value style="color: rgb(8, 153, 129)">
//             0
//           </div>
//           <div class="valueTitle-l31H9iuA">/1บาท</div>
//         </div>
//             `;

//           const node = document.importNode(template.content, true);
//           const highMinusLowEl =
//             node.querySelector<HTMLElement>("[data-value]");
//           baseEl.appendChild(node);

//           const marketOpenning$ = mousemove$.pipe(
//             bahtWeigtPriceByChildNTH(baseEl, 1)
//           );

//           const high$ = mousemove$.pipe(bahtWeigtPriceByChildNTH(baseEl, 2));
//           const low$ = mousemove$.pipe(bahtWeigtPriceByChildNTH(baseEl, 3));
//           const close$ = mousemove$.pipe(bahtWeigtPriceByChildNTH(baseEl, 4));

//           return merge(marketOpenning$, high$, low$, close$).pipe(
//             scan((state, incoming) => ({ ...state, ...incoming }), {}),
//             tap((state) => {
//               if (highMinusLowEl) {
//                 highMinusLowEl.innerText = `${state["H"] - state["L"]}`;
//               }
//             })
//           );
//         })
//       );
//     })
//   )
//   .subscribe();

// function bahtWeigtPriceByChildNTH(
//   baseEl: HTMLElement,
//   nth: number
// ): OperatorFunction<MouseEvent, { [key: string]: number }> {
//   return pipe(
//     map(() => {
//       const openCandleEl = baseEl.children[nth].children[1] as HTMLElement;
//       return Number(openCandleEl.innerText);
//     }),
//     ozToBahtPrice(),
//     map((bahtW) => ({
//       [(baseEl.children[nth].children[0] as HTMLElement).innerText]: bahtW,
//     }))
//   );
// }

// function ozToBahtPrice(): MonoTypeOperatorFunction<number> {
//   return pipe(
//     filter((num) => !isNaN(num)),
//     distinctUntilChanged(),
//     map((oz) => oz / 2.04)
//   );
// }
