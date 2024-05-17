import React, {
  ComponentType,
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TranscationRecord } from "../../../models/transaction-record.model";
import { priceTypography } from "../../../utils/price-typography";
import { formatCurrencyWithoutSymbol } from "../../../utils/format-currency-without-symbol";
import { FOCUS_TYPE } from "../../../models/focus-type.model";
import { Observable } from "rxjs";
import { makeItMovable } from "../../../utils/make-it-movable";

const HIDDEN_STYLE_CLASS = "chrome-hidden";

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
    <div className="textBlock">
      <span className="textColor01 textPricing" style={{ color: fontColor }}>
        {owner} {bahtDiffPrice} {totalDiffPrice} {transactionType}
      </span>
    </div>
  );
});

interface TransactionsProps {
  transactions$: Observable<TranscationRecord[]>;
  visible: boolean;
}

const Transactions: React.FC<TransactionsProps> = (
  props: TransactionsProps
) => {
  const { transactions$ } = props;
  const [transactions, setTransactions] = useState<TranscationRecord[]>([]);

  useEffect(() => {
    const subscription = transactions$.subscribe((trans) =>
      setTransactions(trans)
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [transactions$]);

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

  const nodeClassName = useMemo(
    () => (props.visible ? "" : "chrome-hide"),
    [props.visible]
  );

  return (
    <div
      ref={containerRef}
      className={`chrome-fixed ${nodeClassName}`}
      style={{ display: "flex", flexDirection: "column", rowGap: "0.5rem" }}
    >
      <div className={classNameToSell}>
        {transactionsToSell.map((tran) => (
          <TransactionRecord value={tran}></TransactionRecord>
        ))}
      </div>
      <div className={classNameToBuy}>
        {transactionsToBuy.map((tran) => (
          <TransactionRecord value={tran}></TransactionRecord>
        ))}
      </div>
    </div>
  );
};
export default Transactions;
