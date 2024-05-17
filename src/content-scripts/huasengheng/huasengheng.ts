/// <reference types="chrome-types" />
import { map } from "rxjs/operators";

import { FOCUS_TYPE } from "../../models/focus-type.model";
import { sendTransactionsToSW } from "../../utils/send-transactions-to-sw";
// import { displayTranscation } from "../../utils/display-transaction";
import { speakAtThePeak } from "../../utils/speak-at-the-peak";
import { transactionChanges } from "./transaction-changes";
import { WEIGHT_UNIT } from "../../models/weight-unit.model";
import { fromSWMessage } from "../../utils/from-sw-message";
import { filterBadgeText } from "../../utils/filter-badge-text";

enum OWNER {
  T = "T",
  S = "S",
}
/**
 * fetch API was using now
 * watch content change on this site will be replaced
 * will be deprecated soon
 */
// transactionChanges({
//   focusTrans: [
//     {
//       type: FOCUS_TYPE.WANT_TO_SELL,
//       owner: OWNER.T,
//       price: 41990,
//       weight: 10,
//     },
//     {
//       type: FOCUS_TYPE.WANT_TO_SELL,
//       owner: OWNER.S,
//       price: 41680,
//       weight: 5,
//     },
//     {
//       type: FOCUS_TYPE.WANT_TO_SELL,
//       owner: OWNER.T,
//       price: 41690,
//       weight: 5,
//     },
//     {
//       type: FOCUS_TYPE.WANT_TO_SELL,
//       owner: OWNER.T,
//       price: 41430,
//       weight: 14.9386,
//       unit: WEIGHT_UNIT.GRAM,
//     },
//     {
//       type: FOCUS_TYPE.WANT_TO_SELL,
//       owner: OWNER.T,
//       price: 40880,
//       weight: 15.4006,
//       unit: WEIGHT_UNIT.GRAM,
//     },
//     {
//       type: FOCUS_TYPE.WANT_TO_SELL,
//       owner: OWNER.T,
//       price: 40340,
//       weight: 1,
//     },
//   ],
// })
//   .pipe(
//     sendTransactionsToSW(),
//     map((changes) => changes.transactions),
//     displayTranscation(),
//     speakAtThePeak()
//   )
//   .subscribe();

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
