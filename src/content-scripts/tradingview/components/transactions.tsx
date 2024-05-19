import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FOCUS_TYPE } from "../../../models/focus-type.model";
import { TranscationRecord } from "../../../models/transaction-record.model";
import { makeItMovable } from "../../../utils/make-it-movable";
import TransactionRecord from "./transaction-record";
import { useVisibilityState } from "../../../utils/hooks/use-visibility-state";
import {
  TransactionRecordContext,
  createTransactionRecordContext,
} from "../contexts/transaction-record.context";
import { ServiceWorkerMessagesContext } from "../../../utils/contexts/service-worker-messages.context";

const HIDDEN_STYLE_CLASS = "chrome-hidden";

interface TransactionsProps {}

const Transactions: React.FC<TransactionsProps> = (
  props: TransactionsProps
) => {
  const context = useContext(ServiceWorkerMessagesContext);
  const [transactions, setTransactions] = useState<TranscationRecord[]>([]);

  useEffect(() => {
    const subscription = context.transactionChanged.subscribe((trans) =>
      setTransactions(trans.transactions)
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [context]);

  const transactionsToSell = useMemo(
    () => transactions.filter((tran) => tran.type === FOCUS_TYPE.WANT_TO_SELL),
    [transactions]
  );

  const containsToSell = useMemo(
    () => transactionsToSell.length > 0,
    [transactionsToSell]
  );

  const classNameToSell = useMemo(() => {
    let className = `chrome-fixed-block chrome-font chrome-to-sell`;
    if (!containsToSell) {
      className += ` ${HIDDEN_STYLE_CLASS}`;
    }
    return className;
  }, [containsToSell]);

  const transactionsToBuy = useMemo(
    () => transactions.filter((tran) => tran.type === FOCUS_TYPE.WANT_TO_BUY),
    [transactions]
  );

  const containsToBuy = useMemo(
    () => transactionsToBuy.length > 0,
    [transactionsToBuy]
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
      <div className={classNameToSell}>
        {transactionsToSell.map((tran) => (
          <TransactionRecordContext.Provider
            value={createTransactionRecordContext(tran)}
          >
            <TransactionRecord></TransactionRecord>
          </TransactionRecordContext.Provider>
        ))}
      </div>
      <div className={classNameToBuy}>
        {transactionsToBuy.map((tran) => (
          <TransactionRecordContext.Provider
            value={createTransactionRecordContext(tran)}
          >
            <TransactionRecord></TransactionRecord>
          </TransactionRecordContext.Provider>
        ))}
      </div>
    </div>
  );
};
export default Transactions;
