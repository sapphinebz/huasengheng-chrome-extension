import { TransactionChange } from "@models/transaction-change.model";
import { useSyncExternalStore } from "react";
import { Observable, share, shareReplay } from "rxjs";

// SWM = ServiceWorkerMessaging

let globalMessage: TransactionChange = {
  huasenghengSell: 0,
  huasenghengBuy: 0,
  transactions: [],
};

const transactionChanges = new Observable<TransactionChange>((subscriber) => {
  const port = chrome.runtime.connect(chrome.runtime.id, {
    name: document.location.origin,
  });

  const handler = (message: TransactionChange, port: chrome.runtime.Port) => {
    if (hasChanged(globalMessage, message)) {
      message.transactions.sort((a, b) => b.price - a.price);
      globalMessage = message;
      subscriber.next(message);
    }
  };

  port.onMessage.addListener(handler);

  subscriber.add(() => {
    port.onMessage.removeListener(handler);
  });
}).pipe(
  shareReplay({
    bufferSize: 1,
    refCount: true,
  })
);

function hasChanged(cur: TransactionChange, prev: TransactionChange) {
  return (
    cur.huasenghengSell !== prev.huasenghengSell ||
    cur.transactions.length !== prev.transactions.length
  );
}

const subscribeSWM = (handler: () => void) => {
  const subscription = transactionChanges.subscribe(handler);
  return () => {
    subscription.unsubscribe();
  };
};

export default function useSWMTransactionChanged() {
  return useSyncExternalStore(
    subscribeSWM,
    () => globalMessage, // client component
    () => globalMessage // server component
  );
}
