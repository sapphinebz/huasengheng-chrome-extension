import { Observable } from "rxjs";
import { TransactionChange } from "./models/transaction-change.model";
export const TRANSACTION_CHANGES_RECEVING = "transactionChangesReceiving";

export function receiveTransactionsFromSW() {
  const port = chrome.runtime.connect(chrome.runtime.id, {
    name: TRANSACTION_CHANGES_RECEVING,
  });

  return new Observable<TransactionChange>((subscriber) => {
    const callback = (records: TransactionChange) => {
      subscriber.next(records);
    };
    port.onMessage.addListener(callback);

    return () => {
      port.onMessage.removeListener(callback);
    };
  });
}
