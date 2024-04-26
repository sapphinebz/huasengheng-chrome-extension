import { OperatorFunction } from "rxjs";
import { filter } from "rxjs/operators";
import { TransactionChange } from "../huasengheng/models/transaction-change.model";

export function filterTransactions(): OperatorFunction<any, TransactionChange> {
  return filter((event) => "transactions" in event);
}
