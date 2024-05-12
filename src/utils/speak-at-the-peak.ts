import { MonoTypeOperatorFunction } from "rxjs";
import { tap } from "rxjs/operators";
import { TranscationRecord } from "../models/transaction-record.model";
import { FOCUS_TYPE } from "../models/focus-type.model";
import { speakWithSpeechSynthesis } from "./speak-with-speech-synthesis";

export function speakAtThePeak(): MonoTypeOperatorFunction<
  TranscationRecord[]
> {
  let prevTransactions: TranscationRecord[] = [];
  return tap((records) => {
    let index = 0;
    let readyToBuy = false;
    for (const record of records) {
      const { type, diffPrice, totalPrice } = record;
      if (type === FOCUS_TYPE.WANT_TO_SELL) {
        if (diffPrice === 0) {
          speakWithSpeechSynthesis(`ราคาเท่าทุน`);
        } else if (diffPrice > 0) {
          const lastTranscation = prevTransactions?.[index];
          let spokenMessage = `กำไร`;
          if (lastTranscation) {
            if (lastTranscation.totalPrice > totalPrice) {
              spokenMessage = `ลดลง ${spokenMessage}`;
            } else {
              spokenMessage = `เพิ่มขึ้น ${spokenMessage}`;
            }
          }
          speakWithSpeechSynthesis(`${spokenMessage} ${diffPrice}`);
        }
      } else {
        if (diffPrice <= 0) {
          readyToBuy = true;
        }
      }
      index++;
    }
    if (readyToBuy) {
      speakWithSpeechSynthesis(`ราคาพร้อมทำกำไร`);
    }
    prevTransactions = records;
  });
}
