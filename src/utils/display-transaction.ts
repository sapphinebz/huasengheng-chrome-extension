import { MonoTypeOperatorFunction, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { TranscationRecord } from "../models/transaction-record.model";
import { priceTypography } from "./price-typography";
import { formatCurrencyWithoutSymbol } from "./format-currency-without-symbol";
import { FOCUS_TYPE } from "../models/focus-type.model";
import { makeItMovable } from "./make-it-movable";

export function displayTranscation(): MonoTypeOperatorFunction<
  TranscationRecord[]
> {
  const HIDDEN_STYLE_CLASS = "chrome-hidden";

  const containerDiv = document.createElement("div");
  containerDiv.className = `chrome-fixed`;
  containerDiv.style.cssText = `display:flex; flex-direction:column; row-gap:0.5rem`;
  document.body.appendChild(containerDiv);
  const movableSub = makeItMovable(containerDiv).subscribe();

  const toSellFixedEl = document.createElement("div");
  toSellFixedEl.className = `chrome-fixed-block chrome-font chrome-to-sell ${HIDDEN_STYLE_CLASS}`;
  containerDiv.appendChild(toSellFixedEl);

  const toBuyFixedEl = document.createElement("div");
  toBuyFixedEl.className = `chrome-fixed-block chrome-font chrome-to-buy ${HIDDEN_STYLE_CLASS}`;
  containerDiv.appendChild(toBuyFixedEl);

  const cleanupUnsub = () => {
    movableSub.unsubscribe();
    toBuyFixedEl.remove();
    toSellFixedEl.remove();
  };

  let subscription: Subscription;
  const cleanup = () => {
    if (subscription && !subscription.closed) {
      subscription.unsubscribe();
    }
  };
  return tap({
    next: (records) => {
      cleanup();
      subscription = new Subscription();
      toSellFixedEl.classList.add(HIDDEN_STYLE_CLASS);
      toBuyFixedEl.classList.add(HIDDEN_STYLE_CLASS);
      records.forEach((record) => {
        const { owner, price, diffPrice, type, totalPrice, weight } = record;
        const { prefix, fontColor } = priceTypography(diffPrice, type);
        const bahtDiffPrice = `${formatCurrencyWithoutSymbol(
          price
        )}(${prefix}${formatCurrencyWithoutSymbol(diffPrice)})`;

        const totalDiffPrice = `${prefix}${formatCurrencyWithoutSymbol(
          totalPrice
        )}`;

        const transactionType = `${
          type === FOCUS_TYPE.WANT_TO_BUY ? "รอซื้อ" : "รอขาย"
        }`;

        const contentEl = document.createElement("div");
        contentEl.className = `textBlock`;
        contentEl.innerHTML = `<span class="textColor01 textPricing" style="color: ${fontColor};">${owner} ${bahtDiffPrice} ${totalDiffPrice} ${transactionType}</span>`;
        if (type === FOCUS_TYPE.WANT_TO_BUY) {
          toBuyFixedEl.appendChild(contentEl);
          toBuyFixedEl.classList.remove(HIDDEN_STYLE_CLASS);
        } else {
          toSellFixedEl.appendChild(contentEl);
          toSellFixedEl.classList.remove(HIDDEN_STYLE_CLASS);
        }

        subscription.add(() => {
          contentEl.remove();
        });
      });
    },
    unsubscribe: () => {
      cleanup();
      cleanupUnsub();
    },
    complete: () => {
      cleanup();
      cleanupUnsub();
    },
  });
}
