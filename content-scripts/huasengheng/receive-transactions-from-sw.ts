import { Observable, Subject, timer } from "rxjs";
import { switchMap } from "rxjs/operators";
import { TransactionChange } from "./models/transaction-change.model";
import { currentThaiTime } from "../utils/current-thai-time";
export const TRANSACTION_CHANGES_RECEVING = "transactionChangesReceiving";

export function transactionsChangesFromSW() {
  return new Observable<TransactionChange>((subscriber) => {
    // say hi
    chrome.runtime.sendMessage({ name: "tradingView" });

    // timer to keep connections
    const onUpdated = new Subject<void>();
    const suptime = onUpdated
      .pipe(switchMap(() => timer(10000)))
      .subscribe(() => {
        chrome.runtime.sendMessage({ name: "tradingView" });
      });

    subscriber.add(suptime);
    const callback = (records: TransactionChange) => {
      console.log(`sw`, records, `${currentThaiTime()}`);
      subscriber.next(records);
      onUpdated.next();
      return undefined;
    };
    chrome.runtime.onMessage.addListener(callback);
    subscriber.add(() => {
      chrome.runtime.onMessage.removeListener(callback);
    });
  });
}
