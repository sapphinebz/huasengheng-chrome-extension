import { FocusedTransaction } from "../models/focus-transaction.model";
import { FOCUS_TYPE } from "../models/focus-type.model";
import { TranscationRecord } from "../models/transaction-record.model";
import { currencyToNum } from "./currency-to-num";
import { transparentWeight } from "./transparent-weight";

export function convertToTransactionChanges(options: {
  focusTrans: FocusedTransaction[];
  buy: string;
  sell: string;
}): TranscationRecord[] {
  const { focusTrans, buy, sell } = options;
  focusTrans.sort((a, b) => b.price - a.price);
  const records = focusTrans.map(({ owner, price, weight, type, unit }) => {
    let textPrice = "0";
    if (type === FOCUS_TYPE.WANT_TO_BUY) {
      textPrice = sell;
    } else if (type === FOCUS_TYPE.WANT_TO_SELL) {
      textPrice = buy;
    }
    const weightInBaht = transparentWeight(weight, unit);
    const currentPrice = currencyToNum(textPrice);
    const diffPrice = currentPrice - price;
    const totalPrice = diffPrice * weightInBaht;
    const record: TranscationRecord = {
      owner,
      diffPrice,
      price,
      totalPrice,
      type,
      weight: weightInBaht,
    };
    return record;
  });
  return records;
}
