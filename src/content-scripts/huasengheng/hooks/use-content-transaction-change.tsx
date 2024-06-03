import { TransactionChange } from "@models/transaction-change.model";
import { convertToTransactionChanges } from "@utils/convert-to-transaction-changes";
import { currencyToNum } from "@utils/currency-to-num";
import { getInvestmentsStorage } from "@utils/get-investments-storage";
import { watchContentChanges } from "@utils/watch-content-changes";
import { useSyncExternalStore } from "react";
import { EMPTY, combineLatest, map, shareReplay } from "rxjs";

let globalMessage: TransactionChange = {
  huasenghengSell: 0,
  huasenghengBuy: 0,
  transactions: [],
};

function getTransactionChanges() {
  return combineLatest([getInvestmentsStorage(), getPriceSchedule()]).pipe(
    map(([investments, { huasenghengBuy, huasenghengSell }]) => {
      const transactions = convertToTransactionChanges({
        focusTrans: investments,
        sell: huasenghengSell,
        buy: huasenghengBuy,
      });
      transactions.sort((a, b) => b.price - a.price);
      const changes = {
        huasenghengBuy,
        huasenghengSell,
        transactions,
      } as TransactionChange;
      globalMessage = changes;

      return changes;
    })
  );
}

function getPriceSchedule() {
  const huasenghengSellEl = document.querySelector<HTMLSpanElement>("#ask965");
  const huasenghengBuyEl = document.querySelector<HTMLSpanElement>("#bid965");
  if (huasenghengSellEl && huasenghengBuyEl) {
    return watchContentChanges(huasenghengSellEl).pipe(
      map(() => ({
        huasenghengBuy: currencyToNum(huasenghengBuyEl.innerText),
        huasenghengSell: currencyToNum(huasenghengSellEl.innerText),
      }))
    );
  }
  return EMPTY;
}

const transactionChanges = getTransactionChanges().pipe(
  shareReplay({
    bufferSize: 1,
    refCount: true,
  })
);

const subscribeContent = (handler: () => void) => {
  const subscription = transactionChanges.subscribe(handler);
  return () => {
    subscription.unsubscribe();
  };
};

export default function useContentTransactionChange() {
  return useSyncExternalStore(
    subscribeContent,
    () => globalMessage, // client component
    () => globalMessage // server component
  );
}
