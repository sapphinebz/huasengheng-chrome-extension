import { MonoTypeOperatorFunction } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { TransactionChange } from "../models/transaction-change.model";

export function distinctTransactions(): MonoTypeOperatorFunction<TransactionChange> {
  return distinctUntilChanged((prev, curr) => {
    return (
      curr.huasenghengBuy === prev.huasenghengBuy &&
      curr.huasenghengSell === prev.huasenghengSell &&
      curr.transactions.length == prev.transactions.length
    );
  });
}
