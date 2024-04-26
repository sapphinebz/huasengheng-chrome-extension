/// <reference types="chrome-types" />

import {
  MonoTypeOperatorFunction,
  Observable,
  combineLatest,
  using,
} from "rxjs";
import { filter, map, share, switchMap } from "rxjs/operators";
import { TransactionChange } from "../content-scripts/huasengheng/models/transaction-change.model";

console.log("service worker");
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "ON",
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (
    tab.url?.startsWith("https://www.huasengheng.com") ||
    tab.url?.startsWith("https://s.tradingview.com/") ||
    tab.url?.startsWith("https://www.tradingview.com/chart")
  ) {
    const tabId = tab.id;
    if (tabId) {
      const prevState = await chrome.action.getBadgeText({ tabId });
      const nextState = prevState === "ON" ? "OFF" : "ON";
      await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
      });
      await chrome.tabs.sendMessage(tabId, {
        badgeText: nextState,
      });
    }
  }
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
    const huasengheng$ = contentScripts$.pipe(
      filter(({ senderUrl }) =>
        senderUrl.startsWith("https://www.huasengheng.com")
      ),
      map<ContentScriptMessage, TransactionChange>((ms) => ms.message)
    );

    const target$ = contentScripts$.pipe(
      filter(({ senderUrl }) => senderUrl.startsWith(url))
    );

    return using(
      () => {
        return combineLatest([huasengheng$, target$])
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
