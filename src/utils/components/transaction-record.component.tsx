import { FOCUS_TYPE } from "@models/focus-type.model";
import { TranscationRecord } from "@models/transaction-record.model";
import { formatCurrencyWithoutSymbol } from "@utils/format-currency-without-symbol";
import { useMutedState } from "@utils/hooks/use-muted-state";
import { priceTypography } from "@utils/price-typography";
import * as React from "react";
import MutedIcon from "./muted-icon";

interface Props {
  record: TranscationRecord;
}

const TransactionRecordComponent: React.FC<Props> = React.memo((props) => {
  const { prefix, fontColor } = React.useMemo(() => {
    const { diffPrice, type } = props.record;
    return priceTypography(diffPrice, type);
  }, [props.record]);

  const bahtDiffPrice = React.useMemo(() => {
    const { price, diffPrice } = props.record;
    return `${formatCurrencyWithoutSymbol(
      price
    )}(${prefix}${formatCurrencyWithoutSymbol(diffPrice)})`;
  }, [props.record, prefix]);

  const totalDiffPrice = React.useMemo(() => {
    const { totalPrice } = props.record;
    return `${prefix}${formatCurrencyWithoutSymbol(totalPrice)}`;
  }, [props.record, prefix]);

  const transactionType = React.useMemo(() => {
    const { type } = props.record;
    return `${type === FOCUS_TYPE.WANT_TO_BUY ? "รอซื้อ" : "รอขาย"}`;
  }, [props.record]);

  const recordText = React.useMemo(() => {
    const { owner } = props.record;
    return `${owner} ${bahtDiffPrice} ${totalDiffPrice} ${transactionType}`;
  }, [props.record, bahtDiffPrice, totalDiffPrice, transactionType]);

  const [muted, setMuted] = useMutedState(props.record);

  const mutedColor = React.useMemo(() => (!muted ? "#0fb153" : ""), [muted]);

  return (
    <div
      className="textBlock"
      style={{ display: "flex", columnGap: "0.25rem" }}
    >
      <span className="textColor01 textPricing" style={{ color: fontColor }}>
        {recordText}
      </span>
      <span className="reading-text-color" style={{ color: mutedColor }}>
        <MutedIcon muted={muted} onClickToggle={setMuted}></MutedIcon>
      </span>
    </div>
  );
});

export default TransactionRecordComponent;
