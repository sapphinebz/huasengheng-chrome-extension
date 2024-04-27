import { MonoTypeOperatorFunction, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { formatCurrencyWithoutSymbol } from "../utils/format-currency-without-symbol";
import { TransactionChange } from "../models/transaction-change.model";

const template = document.createElement("template");
template.innerHTML = `
    <div class="chrome-hua-fixed chrome-hua-font">
        <div>
            <div class="chrome-hua-header-buy" >รับซื้อ</div>
            <div class="chrome-hua-value-buy" ></div>
        </div>
        <div>
            <div class="chrome-hua-header-sell" >ขายออก</div>
            <div class="chrome-hua-value-sell" ></div>
        </div>
    </div>
    `;

export function displayHuasenghengBuySell(): MonoTypeOperatorFunction<TransactionChange> {
  const node = document.importNode(template.content, true);
  const buyEl = node.querySelector<HTMLElement>(".chrome-hua-value-buy");
  const sellEl = node.querySelector<HTMLElement>(".chrome-hua-value-sell");
  document.body.appendChild(node);
  return tap((changes) => {
    if (buyEl) {
      buyEl.innerText = formatCurrencyWithoutSymbol(changes.huasenghengBuy);
    }
    if (sellEl) {
      sellEl.innerText = formatCurrencyWithoutSymbol(changes.huasenghengSell);
    }
  });
}
