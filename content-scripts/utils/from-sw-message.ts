import { Observable, Subject, timer } from "rxjs";
import { switchMap } from "rxjs/operators";
export const TRANSACTION_CHANGES_RECEVING = "transactionChangesReceiving";

export function fromSWMessage() {
  const initialMessage = { name: "hello" };
  return new Observable<any>((subscriber) => {
    // say hi
    chrome.runtime.sendMessage(initialMessage);

    // timer to keep alives connection
    const onUpdated = new Subject<void>();
    const suptime = onUpdated
      .pipe(switchMap(() => timer(10000)))
      .subscribe(() => {
        chrome.runtime.sendMessage(initialMessage);
      });

    subscriber.add(suptime);
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
