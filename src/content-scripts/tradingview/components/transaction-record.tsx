import React, { useMemo } from "react";
import { FOCUS_TYPE } from "../../../models/focus-type.model";
import { TranscationRecord } from "../../../models/transaction-record.model";
import { formatCurrencyWithoutSymbol } from "../../../utils/format-currency-without-symbol";
import { priceTypography } from "../../../utils/price-typography";
import VolumeState from "./volume-state";

const TransactionRecord = React.memo((props: { value: TranscationRecord }) => {
  const { owner, price, diffPrice, type, totalPrice, weight } = props.value;

  const { prefix, fontColor } = useMemo(
    () => priceTypography(diffPrice, type),
    [diffPrice, type]
  );

  const bahtDiffPrice = useMemo(
    () =>
      `${formatCurrencyWithoutSymbol(
        price
      )}(${prefix}${formatCurrencyWithoutSymbol(diffPrice)})`,
    [prefix, diffPrice]
  );

  const totalDiffPrice = useMemo(
    () => `${prefix}${formatCurrencyWithoutSymbol(totalPrice)}`,
    [prefix, totalPrice]
  );

  const transactionType = useMemo(
    () => `${type === FOCUS_TYPE.WANT_TO_BUY ? "รอซื้อ" : "รอขาย"}`,
    [type]
  );

  return (
    <div
      className="textBlock"
      style={{ display: "flex", columnGap: "0.25rem" }}
    >
      <span className="textColor01 textPricing" style={{ color: fontColor }}>
        {owner} {bahtDiffPrice} {totalDiffPrice} {transactionType}
      </span>
      <span className="reading-text-color">
        <VolumeState state="on"></VolumeState>
      </span>
    </div>
  );
});

export default TransactionRecord;
