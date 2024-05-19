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
import { TransactionRecordContext } from "../contexts/transaction-record.context";
import { TransactionsContext } from "../contexts/transactions.context";
import MutedIcon from "../../../utils/components/muted-icon";
import { useObservableState } from "../../../utils/hooks/use-observable-state";

import { share } from "rxjs";
import { useSpeakDiffPrices } from "../../../utils/hooks/use-speak-diff-prices";

interface Props {}
const TransactionRecord: React.FC<Props> = React.memo(() => {
  const recordContext = useContext(TransactionRecordContext);
  const transactionsContext = useContext(TransactionsContext);

  useEffect(() => {
    const model = recordContext.model;
    transactionsContext.setDiffPrice(model);
  }, [recordContext, transactionsContext]);

  const { prefix, fontColor } = useMemo(() => {
    const model = recordContext.model;
    return priceTypography(model.diffPrice, model.type);
  }, [recordContext]);

  const bahtDiffPrice = useMemo(() => {
    const { price, diffPrice } = recordContext.model;
    return `${formatCurrencyWithoutSymbol(
      price
    )}(${prefix}${formatCurrencyWithoutSymbol(diffPrice)})`;
  }, [recordContext, prefix]);

  const totalDiffPrice = useMemo(() => {
    const { totalPrice } = recordContext.model;
    return `${prefix}${formatCurrencyWithoutSymbol(totalPrice)}`;
  }, [recordContext, prefix]);

  const transactionType = useMemo(() => {
    const { type } = recordContext.model;
    return `${type === FOCUS_TYPE.WANT_TO_BUY ? "รอซื้อ" : "รอขาย"}`;
  }, [recordContext]);

  const recordText = useMemo(() => {
    const { owner } = recordContext.model;
    return `${owner} ${bahtDiffPrice} ${totalDiffPrice} ${transactionType}`;
  }, [recordContext, bahtDiffPrice, totalDiffPrice, transactionType]);

  const diffPriceChanges = useDiffPriceChanges();
  const mutedChanges = useMutedChanges();

  const [muted] = useObservableState(mutedChanges, true);
  useSpeakDiffPrices(mutedChanges, diffPriceChanges);

  const onMutedClickToggle = useCallback(
    (value: boolean) => {
      transactionsContext.setMuted(recordContext.model, value);
    },
    [recordContext, transactionsContext]
  );

  return (
    <div
      className="textBlock"
      style={{ display: "flex", columnGap: "0.25rem" }}
    >
      <span className="textColor01 textPricing" style={{ color: fontColor }}>
        {recordText}
      </span>
      <span className="reading-text-color">
        <MutedIcon muted={muted} onClickToggle={onMutedClickToggle}></MutedIcon>
      </span>
    </div>
  );
});

function useDiffPriceChanges() {
  const recordContext = useContext(TransactionRecordContext);
  const transactionsContext = useContext(TransactionsContext);
  return useMemo(() => {
    return transactionsContext
      .diffPriceChanges(recordContext.model)
      .pipe(share());
  }, [recordContext, transactionsContext]);
}

function useMutedChanges() {
  const recordContext = useContext(TransactionRecordContext);
  const transactionsContext = useContext(TransactionsContext);
  return useMemo(() => {
    return transactionsContext.muteChanges(recordContext.model).pipe(share());
  }, [recordContext, transactionsContext]);
}

export default TransactionRecord;
