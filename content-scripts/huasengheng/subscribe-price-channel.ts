import { NEVER, from, noop } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { watchContentChanges } from "../utils/watch-content-changes";
import { FocusObj } from "./models/focus-obj.model";
import { cleanupAll } from "../utils/clean-up-all";
import { currencyToNum } from "../utils/currency-to-num";
import { appendContentElement } from "./append-content-element";
import { formatCurrencyWithoutSymbol } from "../utils/format-currency-without-symbol";
import { priceTypography } from "./price-typography";
import { currentThaiTime } from "../utils/current-thai-time";
import { FOCUS_TYPE } from "./models/focus-type.model";
import { speakWithSpeechSynthesis } from "../utils/speak-with-speech-synthesis";

interface TransactionHistory {
  totalPrice: number;
}
export function subscribePriceChannel({
  focusObj = [],
}: {
  focusObj?: FocusObj[];
}) {
  const huasenghengBuyInPriceEl =
    document.querySelector<HTMLElement>("#bid965");
  const huasenghengSellInPriceEl =
    document.querySelector<HTMLElement>("#ask965");

  const transactionHistory: TransactionHistory[][] = [];

  if (focusObj.length && huasenghengSellInPriceEl && huasenghengBuyInPriceEl) {
    // sell price change then buy price always change

    let cleanups: (() => void)[] = [];
    const subscription = watchContentChanges(
      huasenghengSellInPriceEl
    ).subscribe(() => {
      // speakWithSpeechSynthesis(huasenghengBuyInPriceEl.innerText);
      console.log(`${currentThaiTime()} ${huasenghengBuyInPriceEl.innerText}`);
      cleanupAll(cleanups);
      let sumPrice = 0;
      const transactions: TransactionHistory[] = [];
      focusObj.forEach(
        ({ owner, price: focusPrice, weight: focusWeight, type }, index) => {
          let textPrice = "0";
          if (type === FOCUS_TYPE.WANT_TO_BUY) {
            textPrice = huasenghengSellInPriceEl.innerText;
          } else if (type === FOCUS_TYPE.WANT_TO_SELL) {
            textPrice = huasenghengBuyInPriceEl.innerText;
          }
          const currentPrice = currencyToNum(textPrice);
          const diffPrice = currentPrice - focusPrice;
          const totalPrice = diffPrice * focusWeight;
          const { prefix, fontColor } = priceTypography(diffPrice, type);

          if (type === FOCUS_TYPE.WANT_TO_SELL) {
            if (diffPrice === 0) {
              speakWithSpeechSynthesis(`ราคาเท่าทุน`);
            } else if (diffPrice > 0) {
              const lastTranscation =
                transactionHistory[transactionHistory.length - 1]?.[index];
              let spokenMessage = `กำไร`;
              if (lastTranscation) {
                if (lastTranscation.totalPrice > totalPrice) {
                  spokenMessage = `ลดลง ${spokenMessage}`;
                } else {
                  spokenMessage = `เพิ่มขึ้น ${spokenMessage}`;
                }
              }
              speakWithSpeechSynthesis(`${spokenMessage} ${totalPrice}`);
            }
          } else {
            if (diffPrice === 0) {
              speakWithSpeechSynthesis(`ราคาถึงเป้า`);
            } else if (diffPrice < 0) {
              speakWithSpeechSynthesis(`ถูกกว่าเป้า ${diffPrice}`);
            }
          }

          transactions.push({
            totalPrice,
          });

          sumPrice += totalPrice;
          const element = appendContentElement({
            fontColor,
            text: `${owner} ${formatCurrencyWithoutSymbol(
              focusPrice
            )} ${prefix}${diffPrice} ${prefix}${formatCurrencyWithoutSymbol(
              totalPrice
            )}/${focusWeight} ${
              type === FOCUS_TYPE.WANT_TO_BUY ? "รอซื้อ" : "รอขาย"
            }`,
          });
          cleanups.push(() => element && element.remove());
        }
      );

      transactionHistory.push(transactions);
    });
    return subscription.unsubscribe.bind(subscription);
  }

  return noop;
}
