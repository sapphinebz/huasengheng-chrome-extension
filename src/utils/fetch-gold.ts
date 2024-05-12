import { EMPTY, MonoTypeOperatorFunction, OperatorFunction, timer } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import {
  catchError,
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
} from "rxjs/operators";
import { FocusedTransaction } from "../models/focus-transaction.model";
import { TransactionChange } from "../models/transaction-change.model";
import { currencyToNum } from "./currency-to-num";
import { convertToTransactionChanges } from "./convert-to-transaction-changes";

export interface GetPriceRes {
  GoldType: string;
  GoldCode: string;
  Buy: string;
  Sell: string;
  TimeUpdate: string;
  BuyChange: number;
  SellChange: number;
  PresentDate: string;
  FxAsk?: any;
  FxBid?: any;
  Bid?: any;
  Ask?: any;
  QtyBid?: any;
  QtyAsk?: any;
  Discount?: any;
  Premium?: any;
  Increment?: any;
  SourcePrice?: any;
  StrTimeUpdate: string;
}

export function getPrice() {
  return fromFetch<GetPriceRes[]>(
    "https://apicheckprice.huasengheng.com/api/values/getprice/",
    {
      selector: (res) => res.json(),
    }
  );
}

export function getPriceSchedule(options: {
  GoldType: "HSH" | "REF" | "JEWEL";
  period: number;
}) {
  return timer(0, options.period).pipe(
    ignoreWeekend(),
    exhaustMap(() =>
      getPrice().pipe(
        catchError(() => EMPTY),
        map((prices) =>
          prices.find((price) => price.GoldType === options.GoldType)
        )
      )
    ),
    filter((price): price is GetPriceRes => Boolean(price)),
    distinctUntilChanged((prev, cur) => prev.Buy === cur.Buy)
  );
}

function isWeekend() {
  const today = new Date();
  return today.getDay() === 0 || today.getDay() === 6;
}

export function ignoreWeekend<T>(): MonoTypeOperatorFunction<T> {
  return filter(() => !isWeekend());
}

export function toTransactionChange(
  focusTrans: FocusedTransaction[]
): OperatorFunction<GetPriceRes, TransactionChange> {
  return map((price) => {
    return {
      huasenghengBuy: currencyToNum(price.Buy),
      huasenghengSell: currencyToNum(price.Sell),
      transactions: convertToTransactionChanges({
        focusTrans: focusTrans,
        sell: price.Sell,
        buy: price.Buy,
      }),
    } as TransactionChange;
  });
}
