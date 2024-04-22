import { NEVER, Observable } from "rxjs";
import { FocusObj } from "./models/focus-obj.model";
import { TranscationRecord } from "./models/transaction-record.model";
import { FOCUS_TYPE } from "./models/focus-type.model";
import { currencyToNum } from "../utils/currency-to-num";
import { watchContentChanges } from "../utils/watch-content-changes";
import { TransactionChange } from "./models/transaction-change.model";
import { WEIGHT_UNIT } from "./models/weight-unit.model";
import { gramToBaht } from "../utils/gram-to-baht";

export function transactionChanges({
  focusObj = [],
}: {
  focusObj?: FocusObj[];
}) {
  const huasenghengBuyInPriceEl =
    document.querySelector<HTMLElement>("#bid965");
  const huasenghengSellInPriceEl =
    document.querySelector<HTMLElement>("#ask965");
  if (focusObj.length && huasenghengSellInPriceEl && huasenghengBuyInPriceEl) {
    return new Observable<TransactionChange>((subscriber) => {
      const subscription = watchContentChanges(
        huasenghengSellInPriceEl
      ).subscribe(() => {
        const records = focusObj.map(({ owner, price, weight, type, unit }) => {
          let textPrice = "0";
          if (type === FOCUS_TYPE.WANT_TO_BUY) {
            textPrice = huasenghengSellInPriceEl.innerText;
          } else if (type === FOCUS_TYPE.WANT_TO_SELL) {
            textPrice = huasenghengBuyInPriceEl.innerText;
          }
          const weightInBaht = transparentWeight(weight, unit);
          const currentPrice = currencyToNum(textPrice);
          const diffPrice = currentPrice - price;
          const totalPrice = diffPrice * weightInBaht;
          const record: TranscationRecord = {
            owner,
            diffPrice,
            price,
            totalPrice,
            type,
            weight,
          };
          return record;
        });
        subscriber.next({
          huasenghengBuy: currencyToNum(huasenghengBuyInPriceEl.innerText),
          huasenghengSell: currencyToNum(huasenghengSellInPriceEl.innerText),
          transactions: records,
        });
      });

      return subscription;
    });
  }
  return NEVER;
}

function transparentWeight(weight: number, unit?: WEIGHT_UNIT) {
  if (unit === WEIGHT_UNIT.GRAM) {
    return gramToBaht(weight);
  }
  return weight;
}
