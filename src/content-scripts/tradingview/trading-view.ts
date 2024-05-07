import { map, share } from "rxjs/operators";
import { displayHuasenghengBuySell } from "../../utils/display-huasengheng-buy-sell";
import { displayTranscation } from "../../utils/display-transaction";

import { distinctTransactions } from "../../utils/distinct-transactions";
import { filterBadgeText } from "../../utils/filter-badge-text";
import { filterTransactions } from "../../utils/filter-transactions";
import { fromSWMessage } from "../../utils/from-sw-message";
import { speakAtThePeak } from "../../utils/speak-at-the-peak";
console.log("trading-view ready");

const serviceWorkerMSG$ = fromSWMessage({
  keepAliveEvery: 10000,
}).pipe(share());

const transactionChange$ = serviceWorkerMSG$.pipe(
  filterTransactions(),
  distinctTransactions(),
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
    displayTranscation(),
    speakAtThePeak()
  )
  .subscribe();

transactionChange$.pipe(displayHuasenghengBuySell()).subscribe();
