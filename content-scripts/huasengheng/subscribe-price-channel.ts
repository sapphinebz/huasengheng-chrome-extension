import { noop } from "rxjs";
import { watchContentChanges } from "../utils/watch-content-changes";
import { FocusObj } from "./models/focus-obj.model";
import { cleanupAll } from "../utils/clean-up-all";
import { currencyToNum } from "../utils/currency-to-num";
import { appendContentElement } from "./append-content-element";
import { formatCurrencyWithoutSymbol } from "../utils/format";
import { priceTypography } from "./price-typography";
import { currentThaiTime } from "../utils/current-thai-time";

export function subscribePriceChannel({
  watchToSell = false,
  watchToBuy = false,
  focusObj = [],
}: {
  watchToSell?: boolean;
  watchToBuy?: boolean;
  focusObj?: FocusObj[];
}) {
  let channelEl: HTMLElement | null = null;
  if (watchToSell) {
    channelEl = document.querySelector<HTMLElement>("#bid965");
  } else if (watchToBuy) {
    channelEl = document.querySelector<HTMLElement>("#ask965");
  }
  if (channelEl && focusObj.length) {
    let cleanups: (() => void)[] = [];
    const subscription = watchContentChanges(channelEl).subscribe(
      (textPrice) => {
        console.log(`${currentThaiTime()} ${textPrice}`);
        const currentPrice = currencyToNum(textPrice);
        cleanupAll(cleanups);
        let topDs = 0;
        let sumPrice = 0;
        for (const {
          owner,
          price: focusPrice,
          weight: focusWeight,
        } of focusObj) {
          topDs += 1;

          const diffPrice = currentPrice - focusPrice;
          const totalPrice = diffPrice * focusWeight;
          const { prefix, fontColor } = priceTypography(diffPrice);

          sumPrice += totalPrice;
          const element = appendContentElement({
            topDs,
            fontColor,
            text: `${owner} ${prefix}${diffPrice} ${prefix}${formatCurrencyWithoutSymbol(
              totalPrice
            )}/${focusWeight}`,
          });
          topDs += 3;
          cleanups.push(() => element && element.remove());
        }
        topDs += 1;
        const { fontColor: sumPriceFontColor, prefix: sumPricePrefix } =
          priceTypography(sumPrice);
        const element = appendContentElement({
          topDs,
          fontColor: sumPriceFontColor,
          text: `∑ ${sumPricePrefix}${formatCurrencyWithoutSymbol(sumPrice)}`,
        });
        topDs += 3;

        cleanups.push(() => element && element.remove());
      }
    );
    return subscription.unsubscribe.bind(subscription);
  }

  return noop;
}
