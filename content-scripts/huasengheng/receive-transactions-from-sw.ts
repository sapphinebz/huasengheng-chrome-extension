import { Observable } from "rxjs";
import { TransactionChange } from "./models/transaction-change.model";
import { currentThaiTime } from "../utils/current-thai-time";
export const TRANSACTION_CHANGES_RECEVING = "transactionChangesReceiving";

export function receiveTransactionsFromSW() {
  return new Observable<TransactionChange>((subscriber) => {
    // say hi
    chrome.runtime.sendMessage({ name: "tradingView" });
    chrome.runtime.onMessage.addListener((records: TransactionChange) => {
      console.log(`sw`, records, `${currentThaiTime()}`);
      subscriber.next(records);
      return undefined;
    });
  });
}
