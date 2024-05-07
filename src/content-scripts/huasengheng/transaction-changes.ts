import { NEVER, Observable } from "rxjs";
import { FocusedTransaction } from "../../models/focus-transaction.model";
import { TransactionChange } from "../../models/transaction-change.model";
import { convertToTransactionChanges } from "../../utils/convert-to-transaction-changes";
import { currencyToNum } from "../../utils/currency-to-num";
import { watchContentChanges } from "../../utils/watch-content-changes";

export function transactionChanges({
  focusTrans = [],
}: {
  focusTrans?: FocusedTransaction[];
}) {
  const huasenghengBuyInPriceEl =
    document.querySelector<HTMLElement>("#bid965");
  const huasenghengSellInPriceEl =
    document.querySelector<HTMLElement>("#ask965");
  if (
    focusTrans.length &&
    huasenghengSellInPriceEl &&
    huasenghengBuyInPriceEl
  ) {
    return new Observable<TransactionChange>((subscriber) => {
      const subscription = watchContentChanges(
        huasenghengSellInPriceEl
      ).subscribe(() => {
        subscriber.next({
          huasenghengBuy: currencyToNum(huasenghengBuyInPriceEl.innerText),
          huasenghengSell: currencyToNum(huasenghengSellInPriceEl.innerText),
          transactions: convertToTransactionChanges({
            focusTrans,
            sell: huasenghengSellInPriceEl.innerText,
            buy: huasenghengBuyInPriceEl.innerText,
          }),
        });
      });

      return subscription;
    });
  }
  return NEVER;
}
