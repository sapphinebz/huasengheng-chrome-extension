import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import { FocusedTransaction } from "../models/focus-transaction.model";

export function setInvestmentsStorage(list: FocusedTransaction[]) {
  return new Observable<FocusedTransaction[]>((subscriber) => {
    chrome.storage.local
      .set({
        invests: {
          list: list,
        },
      })
      .then(() => {
        if (!subscriber.closed) {
          subscriber.next(list);
        }
        subscriber.complete();
      });
  });
}
