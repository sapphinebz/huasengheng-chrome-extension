/// <reference types="chrome-types" />
import { map } from "rxjs/operators";
import { displayTranscation } from "./display-transaction";
import { FOCUS_TYPE } from "./models/focus-type.model";
import { sendTransactionsToSW } from "./send-transactions-to-sw";
import { speakAtThePeak } from "./speak-at-the-peak";
import { transactionChanges } from "./transaction-changes";
import { WEIGHT_UNIT } from "./models/weight-unit.model";

transactionChanges({
  focusObj: [
    {
      type: FOCUS_TYPE.WANT_TO_SELL,
      owner: "ธนดิตถ์",
      price: 41990,
      weight: 10,
    },
    {
      type: FOCUS_TYPE.WANT_TO_SELL,
      owner: "เสาวลักษณ์",
      price: 41680,
      weight: 5,
    },
    {
      type: FOCUS_TYPE.WANT_TO_SELL,
      owner: "ธนดิตถ์",
      price: 41690,
      weight: 5,
    },
    {
      type: FOCUS_TYPE.WANT_TO_SELL,
      owner: "ธนดิตถ์",
      price: 41430,
      weight: 14.9386,
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
