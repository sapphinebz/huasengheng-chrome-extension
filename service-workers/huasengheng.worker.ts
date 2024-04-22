/// <reference types="chrome-types" />

import { BehaviorSubject } from "rxjs";
import { TRANSACTION_CHANGES_INCOMING } from "../content-scripts/huasengheng/send-transactions-to-sw";
import { TranscationRecord } from "../content-scripts/huasengheng/models/transaction-record.model";
import { TRANSACTION_CHANGES_RECEVING } from "../content-scripts/huasengheng/receive-transactions-from-sw";

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

const transactionsRecords$ = new BehaviorSubject<TranscationRecord[]>([]);
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === TRANSACTION_CHANGES_INCOMING) {
    port.onMessage.addListener((records: TranscationRecord[]) => {
      transactionsRecords$.next(records);
    });
  } else if (port.name === TRANSACTION_CHANGES_RECEVING) {
    transactionsRecords$.subscribe((records) => {
      port.postMessage(records);
    });
  }
});
