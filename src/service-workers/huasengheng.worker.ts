import {
  Observable,
  ReplaySubject,
  connectable,
  firstValueFrom,
  merge,
} from "rxjs";
import { share, shareReplay, switchMap, take } from "rxjs/operators";
import { FocusedTransaction } from "../models/focus-transaction.model";
import { getPriceSchedule, toTransactionChange } from "../utils/fetch-gold";
import { getInvestmentsStorage } from "../utils/get-investments-storage";
import { TransactionChange } from "@models/transaction-change.model";

const investmentsStorage$ = merge(
  getInvestmentsStorage(),
  onInvestmentsStorageChanges()
).pipe(shareReplay(1));

const transactionChanges$ = connectable(
  investmentsStorage$.pipe(
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

  transactionChanges$.connect();
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

tradingViewConnection().subscribe();
// One-time request
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "get-investments-storage") {
    investmentsStorage$.pipe(take(1)).subscribe((investments) => {
      sendResponse(investments);
    });
  }
  return true;
});

function tradingViewConnection() {
  return new Observable<chrome.runtime.Port>((subscriber) => {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.sender?.origin === "https://www.tradingview.com") {
        subscriber.next(port);
        const subscription = transactionChanges$.subscribe(
          (transactionChanged) => {
            console.log("postMessage", transactionChanged);
            port.postMessage(transactionChanged);
          }
        );

        subscriber.add(subscription);
      }
    });
  });
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
