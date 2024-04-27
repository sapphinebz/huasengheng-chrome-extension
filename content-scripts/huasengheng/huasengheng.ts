/// <reference types="chrome-types" />
import { map } from "rxjs/operators";
import { displayTranscation } from "./display-transaction";
import { FOCUS_TYPE } from "../models/focus-type.model";
import { sendTransactionsToSW } from "./send-transactions-to-sw";
import { speakAtThePeak } from "./speak-at-the-peak";
import { transactionChanges } from "./transaction-changes";
import { WEIGHT_UNIT } from "../models/weight-unit.model";
import { fromSWMessage } from "../utils/from-sw-message";
import { filterBadgeText } from "../utils/filter-badge-text";

enum OWNER {
  T = "T",
  S = "S",
}

transactionChanges({
  focusTrans: [
    {
      type: FOCUS_TYPE.WANT_TO_SELL,
      owner: OWNER.T,
      price: 41990,
      weight: 10,
    },
    {
      type: FOCUS_TYPE.WANT_TO_SELL,
      owner: OWNER.S,
      price: 41680,
      weight: 5,
    },
    {
      type: FOCUS_TYPE.WANT_TO_SELL,
      owner: OWNER.T,
      price: 41690,
      weight: 5,
    },
    {
      type: FOCUS_TYPE.WANT_TO_SELL,
      owner: OWNER.T,
      price: 41430,
      weight: 14.9386,
      unit: WEIGHT_UNIT.GRAM,
    },
    {
      type: FOCUS_TYPE.WANT_TO_SELL,
      owner: OWNER.T,
      price: 40910,
      weight: 1.5278,
      unit: WEIGHT_UNIT.GRAM,
    },
  ],
})
  .pipe(
    sendTransactionsToSW(),
    map((changes) => changes.transactions),
    displayTranscation(),
    speakAtThePeak()
  )
  .subscribe();

fromSWMessage()
  .pipe(filterBadgeText())
  .subscribe((event) => {
    const nodeAll = document.querySelectorAll<HTMLElement>(".chrome-fixed");
    for (const node of nodeAll) {
      if (event.badgeText === "ON") {
        node.classList.remove("chrome-hide");
      } else {
        node.classList.add("chrome-hide");
      }
    }
  });
