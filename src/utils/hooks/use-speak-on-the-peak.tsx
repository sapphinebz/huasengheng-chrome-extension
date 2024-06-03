import { useContext, useEffect } from "react";
import { TransactionsContext } from "../../content-scripts/tradingview/contexts/transactions.context";
import { FOCUS_TYPE } from "../../models/focus-type.model";
import { TranscationRecord } from "../../models/transaction-record.model";
import { generateTransactionRecordKey } from "../generate-transaction-record-key";
import { speakWithSpeechSynthesis } from "../speak-with-speech-synthesis";

let prevTransactions: TranscationRecord[];
export function useSpeakOnThePeak(curTransactions: TranscationRecord[]) {
  const transactionsContext = useContext(TransactionsContext);
  useEffect(() => {
    if (!prevTransactions) {
      prevTransactions = curTransactions;
      return;
    }
    for (const transaction of curTransactions) {
      const { type, diffPrice, totalPrice } = transaction;
      const key = generateTransactionRecordKey(transaction);
      const option = transactionsContext.findState(key);
      if (option?.muted) {
        continue;
      }
      if (type === FOCUS_TYPE.WANT_TO_SELL) {
        if (diffPrice === 0) {
          speakWithSpeechSynthesis(`ราคาเท่าทุน`);
        } else if (diffPrice > 0) {
          const lastTranscation = prevTransactions.find(
            (prev) => generateTransactionRecordKey(prev) === key
          );
          if (option) {
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
          const key = generateTransactionRecordKey(transaction);
          const option = transactionsContext.findState(key);
          if (option) {
            speakWithSpeechSynthesis(`ราคาพร้อมทำกำไร ${Math.abs(diffPrice)}`);
          }
        }
      }
    }
  }, [curTransactions, transactionsContext]);
}
