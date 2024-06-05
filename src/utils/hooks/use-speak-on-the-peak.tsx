import { HuasenghengContext } from "@utils/contexts/huasengheng.context";
import { useContext, useEffect } from "react";
import { FOCUS_TYPE } from "../../models/focus-type.model";
import { TranscationRecord } from "../../models/transaction-record.model";
import { generateTransactionRecordKey } from "../generate-transaction-record-key";
import { speakWithSpeechSynthesis } from "../speak-with-speech-synthesis";

let prevTransactions: TranscationRecord[];
export function useSpeakOnThePeak(curTransactions: TranscationRecord[]) {
  const huasenghengContext = useContext(HuasenghengContext);
  useEffect(() => {
    if (prevTransactions !== undefined) {
      for (const transaction of curTransactions) {
        const { type, diffPrice, totalPrice } = transaction;
        const state = huasenghengContext.getSnapshot(transaction);
        const key = generateTransactionRecordKey(transaction);
        if (state.muted) {
          continue;
        }
        if (type === FOCUS_TYPE.WANT_TO_SELL) {
          if (diffPrice === 0) {
            speakWithSpeechSynthesis(`ราคาเท่าทุน`);
          } else if (diffPrice > 0) {
            const lastTranscation = prevTransactions.find(
              (prev) => generateTransactionRecordKey(prev) === key
            );
            if (state) {
              let spokenMessage = ``;
              if (lastTranscation) {
                if (lastTranscation.totalPrice > totalPrice) {
                  spokenMessage = `ลดลง กำไร ${diffPrice}`;
                } else {
                  spokenMessage = `เพิ่มขึ้น กำไร ${diffPrice}`;
                }
              }
              speakWithSpeechSynthesis(spokenMessage);
            }
          }
        } else if (type === FOCUS_TYPE.WANT_TO_BUY) {
          if (diffPrice <= 0) {
            speakWithSpeechSynthesis(`ราคาพร้อมทำกำไร ${Math.abs(diffPrice)}`);
          }
        }
      }
    }

    prevTransactions = curTransactions;
  }, [curTransactions]);
}
