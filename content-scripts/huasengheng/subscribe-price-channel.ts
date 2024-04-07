import { NEVER, from, noop } from "rxjs";
import { combineLatestAll, map, mergeMap } from "rxjs/operators";
import { watchContentChanges } from "../utils/watch-content-changes";
import { FocusObj } from "./models/focus-obj.model";
import { cleanupAll } from "../utils/clean-up-all";
import { currencyToNum } from "../utils/currency-to-num";
import { appendContentElement } from "./append-content-element";
import { formatCurrencyWithoutSymbol } from "../utils/format-currency-without-symbol";
import { priceTypography } from "./price-typography";
import { currentThaiTime } from "../utils/current-thai-time";
import { FOCUS_TYPE } from "./models/focus-type.model";

export function subscribePriceChannel({
  focusObj = [],
}: {
  focusObj?: FocusObj[];
}) {
  const huasenghengBuyInPriceEl =
    document.querySelector<HTMLElement>("#bid965");
  const huasenghengSellInPriceEl =
    document.querySelector<HTMLElement>("#ask965");

  if (focusObj.length && huasenghengSellInPriceEl && huasenghengBuyInPriceEl) {
    const typeSets = new Set(focusObj.map((obj) => obj.type));
    const contentChanges$ = from(typeSets).pipe(
      mergeMap((focusType) => {
        if (focusType === FOCUS_TYPE.WANT_TO_BUY) {
          return watchContentChanges(huasenghengSellInPriceEl);
        } else if (focusType === FOCUS_TYPE.WANT_TO_SELL) {
          return watchContentChanges(huasenghengBuyInPriceEl);
        }
        return NEVER;
      })
    );

    let cleanups: (() => void)[] = [];
    const subscription = contentChanges$.subscribe(() => {
      cleanupAll(cleanups);
      let topDs = 0;
      let sumPrice = 0;
      for (const {
        owner,
        price: focusPrice,
        weight: focusWeight,
        type,
      } of focusObj) {
        let textPrice = "0";
        if (type === FOCUS_TYPE.WANT_TO_BUY) {
          textPrice = huasenghengSellInPriceEl.innerText;
        } else if (type === FOCUS_TYPE.WANT_TO_SELL) {
          textPrice = huasenghengBuyInPriceEl.innerText;
        }
        console.log(`${currentThaiTime()} ${textPrice}`);
        const currentPrice = currencyToNum(textPrice);

        topDs += 1;

        const diffPrice = currentPrice - focusPrice;
        const totalPrice = diffPrice * focusWeight;
        const { prefix, fontColor } = priceTypography(diffPrice, type);

        sumPrice += totalPrice;
        const element = appendContentElement({
          topDs,
          fontColor,
          text: `${owner} ${prefix}${diffPrice} ${prefix}${formatCurrencyWithoutSymbol(
            totalPrice
          )}/${focusWeight} ${
            type === FOCUS_TYPE.WANT_TO_BUY ? "รอซื้อ" : "รอขาย"
          }`,
        });
        topDs += 3;
        cleanups.push(() => element && element.remove());
      }

      // topDs += 1;
      // const { fontColor: sumPriceFontColor, prefix: sumPricePrefix } =
      //   priceTypography(sumPrice);
      // const element = appendContentElement({
      //   topDs,
      //   fontColor: sumPriceFontColor,
      //   text: `∑ ${sumPricePrefix}${formatCurrencyWithoutSymbol(sumPrice)}`,
      // });
      // topDs += 3;

      // cleanups.push(() => element && element.remove());
    });
    return subscription.unsubscribe.bind(subscription);
  }

  return noop;
}
