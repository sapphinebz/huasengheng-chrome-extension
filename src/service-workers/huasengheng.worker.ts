/// <reference types="chrome-types" />

import {
  MonoTypeOperatorFunction,
  Observable,
  ReplaySubject,
  combineLatest,
  connectable,
  using,
} from "rxjs";
import { filter, share, switchMap } from "rxjs/operators";
import { FocusedTransaction } from "../models/focus-transaction.model";
import { FOCUS_TYPE } from "../models/focus-type.model";
import { TransactionChange } from "../models/transaction-change.model";
import { WEIGHT_UNIT } from "../models/weight-unit.model";
import { getPriceSchedule, toTransactionChange } from "../utils/fetch-gold";
console.log("service worker");

const focusTrans: FocusedTransaction[] = [
  {
    type: FOCUS_TYPE.WANT_TO_SELL,
    owner: "T",
    price: 41990,
    weight: 10,
  },
  {
    type: FOCUS_TYPE.WANT_TO_SELL,
    owner: "S",
    price: 41680,
    weight: 5,
  },
  {
    type: FOCUS_TYPE.WANT_TO_SELL,
    owner: "T",
    price: 41690,
    weight: 5,
  },
  {
    type: FOCUS_TYPE.WANT_TO_SELL,
    owner: "T",
    price: 41430,
    weight: 14.9386,
    unit: WEIGHT_UNIT.GRAM,
  },
  {
    type: FOCUS_TYPE.WANT_TO_SELL,
    owner: "T",
    price: 40880,
    weight: 15.4006,
    unit: WEIGHT_UNIT.GRAM,
  },
  {
    type: FOCUS_TYPE.WANT_TO_SELL,
    owner: "T",
    price: 40340,
    weight: 1,
  },
];

const transactionChange$ = connectable(
  getPriceSchedule({ GoldType: "HSH", period: 3000 }).pipe(
    toTransactionChange(focusTrans)
  ),
  {
    connector: () => new ReplaySubject(1),
  }
);

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "ON",
  });

  transactionChange$.connect();
  // chrome.tabs.create({
  //   url: "src/popups/popup.html",
  // });
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
