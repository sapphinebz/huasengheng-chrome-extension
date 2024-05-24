/// <reference types="chrome-types" />

import {
  MonoTypeOperatorFunction,
  Observable,
  ReplaySubject,
  combineLatest,
  connectable,
  merge,
  using,
} from "rxjs";
import { filter, share, switchMap } from "rxjs/operators";
import { FocusedTransaction } from "../models/focus-transaction.model";
import { TransactionChange } from "../models/transaction-change.model";
import { getPriceSchedule, toTransactionChange } from "../utils/fetch-gold";
import { getInvestmentsStorage } from "../utils/get-investments-storage";

const investmentsStorageChanges = onInvestmentsStorageChanges().pipe(share());

const transactionChange$ = connectable(
  merge(getInvestmentsStorage(), investmentsStorageChanges).pipe(
    switchMap((focusTrans) => {
      return getPriceSchedule({ GoldType: "HSH", period: 3000 }).pipe(
        toTransactionChange(focusTrans)
      );
    })
  ),
  {
    connector: () => new ReplaySubject(1),
  }
);

chrome.runtime.onInstalled.addListener(() => {
  // chrome.action.setBadgeText({
  //   text: "ON",
  // });

  transactionChange$.connect();
});

chrome.action.onClicked.addListener(async (tab) => {
  chrome.tabs.create({
    url: "src/popups/popup.html",
  });
  // if (
  //   tab.url?.startsWith("https://www.huasengheng.com") ||
  //   tab.url?.startsWith("https://s.tradingview.com/") ||
  //   tab.url?.startsWith("https://www.tradingview.com/chart")
  // ) {
  //   const tabId = tab.id;
  //   if (tabId) {
  //     const prevState = await chrome.action.getBadgeText({ tabId });
  //     const nextState = prevState === "ON" ? "OFF" : "ON";
  //     await chrome.action.setBadgeText({
  //       tabId: tab.id,
  //       text: nextState,
  //     });
  //     await chrome.tabs.sendMessage(tabId, {
  //       badgeText: nextState,
  //     });
  //   }
  // }
});

const contentScript$ = fromContentScript().pipe(share());

contentScript$
  .pipe(
    sendTransactionBackTo("https://s.tradingview.com/"),
    sendTransactionBackTo("https://www.tradingview.com/chart/")
  )
  .subscribe();

interface ContentScriptMessage {
  message: any;
  tabId: number;
  senderUrl: string;
}

function fromContentScript() {
  return new Observable<ContentScriptMessage>((subscriber) => {
    chrome.runtime.onMessage.addListener(
      (message: TransactionChange, sender, sendResponse) => {
        const tabId = sender.tab?.id;
        const senderUrl = sender.url;
        if (tabId && senderUrl) {
          subscriber.next({ tabId, message, senderUrl });
        }

        return undefined;
      }
    );
  });
}

function sendTransactionBackTo(
  url: string
): MonoTypeOperatorFunction<ContentScriptMessage> {
  return (contentScripts$: Observable<ContentScriptMessage>) => {
    const target$ = contentScripts$.pipe(
      filter(({ senderUrl }) => senderUrl.startsWith(url))
    );

    return using(
      () => {
        return combineLatest([transactionChange$, target$])
          .pipe(
            switchMap(async (source) => {
              const [transactions, { tabId }] = source;
              const response = await chrome.tabs.sendMessage(
                tabId,
                transactions
              );
              return response;
            })
          )
          .subscribe();
      },
      () => contentScripts$
    );
  };
}

function onInvestmentsStorageChanges() {
  return new Observable<FocusedTransaction[]>((subscriber) => {
    const callback = (
      changes: {
        [name: string]: chrome.storage.StorageChange;
      },
      area: string
    ) => {
      if (changes.invests) {
        const list = changes.invests.newValue.list;
        subscriber.next(list);
      }
    };
    chrome.storage.onChanged.addListener(callback);
    return () => chrome.storage.onChanged.removeListener(callback);
  });
}
