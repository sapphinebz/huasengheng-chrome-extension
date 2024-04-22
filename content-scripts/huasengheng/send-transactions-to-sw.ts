import { MonoTypeOperatorFunction } from "rxjs";
import { tap } from "rxjs/operators";
import { TransactionChange } from "./models/transaction-change.model";

export const TRANSACTION_CHANGES_INCOMING = "transactionChangesIncoming";

export function sendTransactionsToSW(): MonoTypeOperatorFunction<TransactionChange> {
  const port = chrome.runtime.connect(chrome.runtime.id, {
    name: TRANSACTION_CHANGES_INCOMING,
  });
  return tap((records) => {
    port.postMessage(records);
  });
}
