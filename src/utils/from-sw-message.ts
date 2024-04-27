import { Observable, Subject, timer } from "rxjs";
import { switchMap } from "rxjs/operators";
export const TRANSACTION_CHANGES_RECEVING = "transactionChangesReceiving";

export interface SWMessageConfig {
  // millsec
  keepAliveEvery: number;
}
export function fromSWMessage(configs?: SWMessageConfig) {
  const initialMessage = { name: "hello" };
  return new Observable<any>((subscriber) => {
    const onUpdated = new Subject<void>();
    if (configs?.keepAliveEvery) {
      const { keepAliveEvery } = configs;
      // say hi
      chrome.runtime.sendMessage(initialMessage);

      // timer to keep alives connection
      const suptime = onUpdated
        .pipe(switchMap(() => timer(keepAliveEvery)))
        .subscribe(() => {
          chrome.runtime.sendMessage(initialMessage);
        });

      subscriber.add(suptime);
    }

    const callback = (event: any) => {
      subscriber.next(event);
      onUpdated.next();
      return undefined;
    };

    chrome.runtime.onMessage.addListener(callback);
    subscriber.add(() => {
      chrome.runtime.onMessage.removeListener(callback);
    });
  });
}
