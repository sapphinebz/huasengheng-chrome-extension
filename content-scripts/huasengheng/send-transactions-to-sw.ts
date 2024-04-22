import { MonoTypeOperatorFunction } from "rxjs";
import { tap } from "rxjs/operators";
import { TranscationRecord } from "./models/transaction-record.model";

export const TRANSACTION_CHANGES_INCOMING = "transactionChangesIncoming";

export function sendTransactionsToSW(): MonoTypeOperatorFunction<
  TranscationRecord[]
> {
  const port = chrome.runtime.connect(chrome.runtime.id, {
    name: TRANSACTION_CHANGES_INCOMING,
  });
  return tap((records) => {
    port.postMessage(records);
  });
}
