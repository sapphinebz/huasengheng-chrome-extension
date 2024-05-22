/// <reference types="chrome-types" />

import { Observable } from "rxjs";
import { FocusedTransaction } from "../models/focus-transaction.model";

export function getInvestmentsStorage() {
  return new Observable<FocusedTransaction[]>((subscriber) => {
    chrome.storage.local.get().then((storage) => {
      if (!subscriber.closed) {
        if (storage.invests?.list) {
          const list = storage.invests.list as FocusedTransaction[];
          subscriber.next(list);
        } else {
          subscriber.next([]);
        }
      }

      subscriber.complete();
    });
  });
}
