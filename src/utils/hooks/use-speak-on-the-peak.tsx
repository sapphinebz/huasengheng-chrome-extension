import { Observable, pairwise } from "rxjs";
import { TranscationRecord } from "../../models/transaction-record.model";
import { useContext, useEffect } from "react";
import { TransactionsContext } from "../../content-scripts/tradingview/contexts/transactions.context";
import { FOCUS_TYPE } from "../../models/focus-type.model";
import { speakWithSpeechSynthesis } from "../speak-with-speech-synthesis";
import { generateTransactionRecordKey } from "../generate-transaction-record-key";

export function useSpeakOnThePeak(
  transactionsChanged: Observable<TranscationRecord[]>
) {
  const transactionsContext = useContext(TransactionsContext);
  useEffect(() => {
    const subscription = transactionsChanged
      .pipe(pairwise())
      .subscribe(([prevTransactions, curTransactions]) => {
        for (const transaction of curTransactions) {
          const { type, diffPrice, totalPrice } = transaction;

          if (type === FOCUS_TYPE.WANT_TO_SELL) {
            if (diffPrice === 0) {
              speakWithSpeechSynthesis(`ราคาเท่าทุน`);
            } else if (diffPrice > 0) {
              const key = generateTransactionRecordKey(transaction);
              const lastTranscation = prevTransactions.find(
                (prev) => generateTransactionRecordKey(prev) === key
              );
              const option = transactionsContext.findState(key);
              if (option && !option.muted) {
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
            }
          } else if (type === FOCUS_TYPE.WANT_TO_BUY) {
            if (diffPrice <= 0) {
              const key = generateTransactionRecordKey(transaction);
              const option = transactionsContext.findState(key);
              if (option && !option.muted) {
                speakWithSpeechSynthesis(
                  `ราคาพร้อมทำกำไร ${Math.abs(diffPrice)}`
                );
              }
            }
          }
        }
      });
    return () => subscription.unsubscribe();
  }, [transactionsChanged, transactionsContext]);
}
