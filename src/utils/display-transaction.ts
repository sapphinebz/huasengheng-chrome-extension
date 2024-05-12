import { MonoTypeOperatorFunction, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { TranscationRecord } from "../models/transaction-record.model";
import { priceTypography } from "./price-typography";
import { appendContentElement } from "./append-content-element";
import { formatCurrencyWithoutSymbol } from "./format-currency-without-symbol";
import { FOCUS_TYPE } from "../models/focus-type.model";

export function displayTranscation(): MonoTypeOperatorFunction<
  TranscationRecord[]
> {
  let subscription: Subscription;
  const cleanup = () => {
    if (subscription && !subscription.closed) {
      subscription.unsubscribe();
    }
  };
  return tap({
    next: (records) => {
      cleanup();
      subscription = new Subscription();
      records.forEach((record) => {
        const { owner, price, diffPrice, type, totalPrice, weight } = record;
        const { prefix, fontColor } = priceTypography(diffPrice, type);
        const bahtDiffPrice = `${formatCurrencyWithoutSymbol(
          price
        )}(${prefix}${formatCurrencyWithoutSymbol(diffPrice)})`;

        const totalDiffPrice = `${prefix}${formatCurrencyWithoutSymbol(
          totalPrice
        )}`;

        const transactionType = `${
          type === FOCUS_TYPE.WANT_TO_BUY ? "รอซื้อ" : "รอขาย"
        }`;
        const element = appendContentElement({
          fontColor,
          text: `${owner} ${bahtDiffPrice} ${totalDiffPrice} ${transactionType}`,
        });

        subscription.add(() => {
          element && element.remove();
        });
      });
    },
    unsubscribe: () => {
      cleanup();
    },
    complete: () => {
      cleanup();
    },
  });
}