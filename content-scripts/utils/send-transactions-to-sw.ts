import { MonoTypeOperatorFunction } from "rxjs";
import { tap } from "rxjs/operators";
import { TransactionChange } from "../models/transaction-change.model";
import { currentThaiTime } from "./current-thai-time";

export const TRANSACTION_CHANGES_INCOMING = "transactionChangesIncoming";

export function sendTransactionsToSW(): MonoTypeOperatorFunction<TransactionChange> {
  return tap(async (records) => {
    console.log("postMessage ", records, `${currentThaiTime()}`);
    const response = await chrome.runtime.sendMessage(records);
  });
}
