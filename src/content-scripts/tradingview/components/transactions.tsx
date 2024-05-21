import React, { useContext, useEffect, useMemo, useRef } from "react";
import { distinctUntilChanged, map, share } from "rxjs/operators";
import { FOCUS_TYPE } from "../../../models/focus-type.model";
import { ServiceWorkerMessagesContext } from "../../../utils/contexts/service-worker-messages.context";
import { useObservableState } from "../../../utils/hooks/use-observable-state";
import { useSpeakOnThePeak } from "../../../utils/hooks/use-speak-on-the-peak";
import { useVisibilityState } from "../../../utils/hooks/use-visibility-state";
import { makeItMovable } from "../../../utils/make-it-movable";
import TransactionRecord from "./transaction-record";
import { TranscationRecord } from "../../../models/transaction-record.model";

const HIDDEN_STYLE_CLASS = "chrome-hidden";

interface TransactionsProps {}

const Transactions: React.FC<TransactionsProps> = (
  props: TransactionsProps
) => {
  const transactionsChanged = useTransactionsChanged();

  useSpeakOnThePeak(transactionsChanged);

  const [transactions] = useObservableState(transactionsChanged, []);

  const [toBuyJSXElements, toSellJSXElements] =
    useSeperatedTransactions(transactions);

  const containsToSell = useMemo(
    () => toSellJSXElements.length > 0,
    [toSellJSXElements]
  );

  const classNameToSell = useMemo(() => {
    let className = `chrome-fixed-block chrome-font chrome-to-sell`;
    if (!containsToSell) {
      className += ` ${HIDDEN_STYLE_CLASS}`;
    }
    return className;
  }, [containsToSell]);

  const containsToBuy = useMemo(
    () => toBuyJSXElements.length > 0,
    [toBuyJSXElements]
  );

  const classNameToBuy = useMemo(() => {
    let className = `chrome-fixed-block chrome-font chrome-to-buy`;
    if (!containsToBuy) {
      className += ` ${HIDDEN_STYLE_CLASS}`;
    }
    return className;
  }, [containsToBuy]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const subscription = makeItMovable(el).subscribe();
      return () => subscription.unsubscribe();
    }
  }, [containerRef]);

  const { nodeClassName } = useVisibilityState();

  return (
    <div
      ref={containerRef}
      className={`chrome-fixed ${nodeClassName}`}
      style={{ display: "flex", flexDirection: "column", rowGap: "0.5rem" }}
    >
      <div className={classNameToSell}>{toSellJSXElements}</div>
      <div className={classNameToBuy}>{toBuyJSXElements}</div>
    </div>
  );
};

function useTransactionsChanged() {
  const serviceWorkerContext = useContext(ServiceWorkerMessagesContext);

  return useMemo(
    () =>
      serviceWorkerContext.transactionChanged.pipe(
        map((changed) => changed.transactions),
        distinctUntilChanged(),
        share()
      ),
    [serviceWorkerContext]
  );
}

function useSeperatedTransactions(transactions: TranscationRecord[]) {
  return useMemo(() => {
    const toBuyJSXList: React.JSX.Element[] = [];
    const toSellJSXList: React.JSX.Element[] = [];
    for (const record of transactions) {
      if (record.type === FOCUS_TYPE.WANT_TO_BUY) {
        toBuyJSXList.push(
          <TransactionRecord record={record}></TransactionRecord>
        );
      } else if (record.type === FOCUS_TYPE.WANT_TO_SELL) {
        toSellJSXList.push(
          <TransactionRecord record={record}></TransactionRecord>
        );
      }
    }
    return [toBuyJSXList, toSellJSXList] as const;
  }, [transactions]);
}

export default Transactions;
