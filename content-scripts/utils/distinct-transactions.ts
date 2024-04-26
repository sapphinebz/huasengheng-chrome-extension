import { MonoTypeOperatorFunction } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { TransactionChange } from "../huasengheng/models/transaction-change.model";

export function distinctTransactions(): MonoTypeOperatorFunction<TransactionChange> {
  return distinctUntilChanged(
    (prev, curr) =>
      curr.huasenghengBuy === prev.huasenghengBuy &&
      curr.huasenghengSell === prev.huasenghengSell
  );
}
