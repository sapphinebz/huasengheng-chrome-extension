/// <reference types="chrome-types" />

import { ReplaySubject, combineLatest } from "rxjs";
import { switchMap } from "rxjs/operators";
import { TransactionChange } from "../content-scripts/huasengheng/models/transaction-change.model";

console.log("service worker");
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "ON",
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url?.startsWith("https://www.huasengheng.com")) {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    const nextState = prevState === "ON" ? "OFF" : "ON";
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });
  }
});

const tradingViewTabId$ = new ReplaySubject<number>(1);
const transactionsRecords$ = new ReplaySubject<TransactionChange>(1);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message, sender);
  if (sender.url?.startsWith("https://www.huasengheng.com")) {
    transactionsRecords$.next(message);
  } else if (sender.url?.startsWith("https://s.tradingview.com/")) {
    const tabId = sender.tab?.id;
    if (tabId) {
      tradingViewTabId$.next(tabId);
    }
  }

  return undefined;
});

combineLatest([transactionsRecords$, tradingViewTabId$])
  .pipe(
    switchMap(async ([changes, tabId]) => {
      const response = await chrome.tabs.sendMessage(tabId, changes);
      return response;
    })
  )
  .subscribe();
