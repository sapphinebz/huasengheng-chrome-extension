import { Observable } from "rxjs";
import { TranscationRecord } from "./models/transaction-record.model";
export const TRANSACTION_CHANGES_RECEVING = "transactionChangesReceiving";

export function receiveTransactionsFromSW() {
  const port = chrome.runtime.connect(chrome.runtime.id, {
    name: TRANSACTION_CHANGES_RECEVING,
  });

  return new Observable<TranscationRecord[]>((subscriber) => {
    const callback = (records: TranscationRecord[]) => {
      subscriber.next(records);
    };
    port.onMessage.addListener(callback);

    return () => {
      port.onMessage.removeListener(callback);
    };
  });
}
