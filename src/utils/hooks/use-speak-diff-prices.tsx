import { useContext, useEffect } from "react";
import { EMPTY, Observable, pairwise, switchMap, tap } from "rxjs";
import { TransactionRecordContext } from "../../content-scripts/tradingview/contexts/transaction-record.context";
import { FOCUS_TYPE } from "../../models/focus-type.model";
import { speakWithSpeechSynthesis } from "../speak-with-speech-synthesis";

export function useSpeakDiffPrices(
  mutedChanges: Observable<boolean>,
  diffPriceChanges: Observable<number>
) {
  const recordContext = useContext(TransactionRecordContext);
  useEffect(() => {
    const { model } = recordContext;
    const { type } = model;
    const subscription = mutedChanges
      .pipe(
        switchMap((muted) => {
          if (muted) {
            return EMPTY;
          }
          return diffPriceChanges.pipe(
            pairwise(),
            tap(([prevDiffPrice, curDiffPrice]) => {
              if (type === FOCUS_TYPE.WANT_TO_SELL) {
                if (curDiffPrice === 0) {
                  speakWithSpeechSynthesis(`ราคาเท่าทุน`);
                } else if (curDiffPrice > 0) {
                  let spokenMessage = `กำไร`;

                  if (prevDiffPrice > curDiffPrice) {
                    spokenMessage = `ลดลง ${spokenMessage}`;
                  } else {
                    spokenMessage = `เพิ่มขึ้น ${spokenMessage}`;
                  }

                  speakWithSpeechSynthesis(`${spokenMessage} ${curDiffPrice}`);
                }
              } else if (type === FOCUS_TYPE.WANT_TO_BUY) {
                if (curDiffPrice <= 0) {
                  speakWithSpeechSynthesis(
                    `ราคาพร้อมทำกำไร ${Math.abs(curDiffPrice)}`
                  );
                }
              }
            })
          );
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [diffPriceChanges, mutedChanges, recordContext]);
}
