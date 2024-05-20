import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FOCUS_TYPE } from "../../../models/focus-type.model";
import { formatCurrencyWithoutSymbol } from "../../../utils/format-currency-without-symbol";
import { priceTypography } from "../../../utils/price-typography";
import { TransactionsContext } from "../contexts/transactions.context";
import MutedIcon from "../../../utils/components/muted-icon";
import { useObservableState } from "../../../utils/hooks/use-observable-state";
import { share } from "rxjs";
import { TranscationRecord } from "../../../models/transaction-record.model";

interface Props {
  record: TranscationRecord;
}
const TransactionRecord: React.FC<Props> = React.memo((props) => {
  const transactionsContext = useContext(TransactionsContext);

  useEffect(() => {
    transactionsContext.setDiffPrice(props.record);
  }, [props.record, transactionsContext]);

  const { prefix, fontColor } = useMemo(() => {
    const { diffPrice, type } = props.record;
    return priceTypography(diffPrice, type);
  }, [props.record]);

  const bahtDiffPrice = useMemo(() => {
    const { price, diffPrice } = props.record;
    return `${formatCurrencyWithoutSymbol(
      price
    )}(${prefix}${formatCurrencyWithoutSymbol(diffPrice)})`;
  }, [props.record, prefix]);

  const totalDiffPrice = useMemo(() => {
    const { totalPrice } = props.record;
    return `${prefix}${formatCurrencyWithoutSymbol(totalPrice)}`;
  }, [props.record, prefix]);

  const transactionType = useMemo(() => {
    const { type } = props.record;
    return `${type === FOCUS_TYPE.WANT_TO_BUY ? "รอซื้อ" : "รอขาย"}`;
  }, [props.record]);

  const recordText = useMemo(() => {
    const { owner } = props.record;
    return `${owner} ${bahtDiffPrice} ${totalDiffPrice} ${transactionType}`;
  }, [props.record, bahtDiffPrice, totalDiffPrice, transactionType]);

  const mutedChanges = useMutedChanges(props.record);

  const [muted] = useObservableState(mutedChanges, true);

  const onMutedClickToggle = useCallback(
    (value: boolean) => {
      transactionsContext.setMuted(props.record, value);
    },
    [props.record, transactionsContext]
  );

  const mutedColor = useMemo(() => (!muted ? "#0fb153" : ""), [muted]);

  return (
    <div
      className="textBlock"
      style={{ display: "flex", columnGap: "0.25rem" }}
    >
      <span className="textColor01 textPricing" style={{ color: fontColor }}>
        {recordText}
      </span>
      <span className="reading-text-color" style={{ color: mutedColor }}>
        <MutedIcon muted={muted} onClickToggle={onMutedClickToggle}></MutedIcon>
      </span>
    </div>
  );
});

function useMutedChanges(record: TranscationRecord) {
  const transactionsContext = useContext(TransactionsContext);
  return useMemo(() => {
    return transactionsContext.muteChanges(record).pipe(share());
  }, [record, transactionsContext]);
}

export default TransactionRecord;
