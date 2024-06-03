import { FOCUS_TYPE } from "@models/focus-type.model";
import { TranscationRecord } from "@models/transaction-record.model";
import useMovable from "@utils/hooks/use-movable";
import { useSpeakOnThePeak } from "@utils/hooks/use-speak-on-the-peak";
import useSWM from "@utils/hooks/use-swm";
import * as React from "react";
import TransactionRecord from "./transaction-record";

const HIDDEN_STYLE_CLASS = "chrome-hidden";

interface TransactionsProps {}

const Transactions: React.FC<TransactionsProps> = (
  props: TransactionsProps
) => {
  const transactionChanged = useSWM();

  useSpeakOnThePeak(transactionChanged.transactions);

  const [toBuyJSXElements, toSellJSXElements] = useSeperatedTransactions(
    transactionChanged.transactions
  );

  const containsToSell = React.useMemo(
    () => toSellJSXElements.length > 0,
    [toSellJSXElements]
  );

  const classNameToSell = React.useMemo(() => {
    let className = `chrome-fixed-block chrome-font chrome-to-sell`;
    if (!containsToSell) {
      className += ` ${HIDDEN_STYLE_CLASS}`;
    }
    return className;
  }, [containsToSell]);

  const containsToBuy = React.useMemo(
    () => toBuyJSXElements.length > 0,
    [toBuyJSXElements]
  );

  const classNameToBuy = React.useMemo(() => {
    let className = `chrome-fixed-block chrome-font chrome-to-buy`;
    if (!containsToBuy) {
      className += ` ${HIDDEN_STYLE_CLASS}`;
    }
    return className;
  }, [containsToBuy]);

  const containerRef = useMovable<React.ElementRef<"div">>();

  return (
    <div
      ref={containerRef}
      className="chrome-fixed"
      style={{ display: "flex", flexDirection: "column", rowGap: "0.5rem" }}
    >
      <div className={classNameToSell}>{toSellJSXElements}</div>
      <div className={classNameToBuy}>{toBuyJSXElements}</div>
    </div>
  );
};

function useSeperatedTransactions(transactions: TranscationRecord[]) {
  return React.useMemo(() => {
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
