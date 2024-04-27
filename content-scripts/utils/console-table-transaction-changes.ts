import { MonoTypeOperatorFunction } from "rxjs";
import { tap } from "rxjs/operators";
import { TransactionChange } from "../models/transaction-change.model";
import { currentThaiTime } from "./current-thai-time";

export function consoleTableTransactionChanges(): MonoTypeOperatorFunction<TransactionChange> {
  const transactions: { buy: number; sell: number; time: string }[] = [];
  return tap((changes) => {
    transactions.push({
      buy: changes.huasenghengBuy,
      sell: changes.huasenghengSell,
      time: currentThaiTime(),
    });
    console.table(transactions, ["time", "buy", "sell"]);
  });
}
