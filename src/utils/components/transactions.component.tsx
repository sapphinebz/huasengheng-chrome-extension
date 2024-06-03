import { TransactionChange } from "@models/transaction-change.model";
import { HuasenghengContext } from "@utils/contexts/huasengheng.context";
import useMovable from "@utils/hooks/use-movable";
import { useSpeakOnThePeak } from "@utils/hooks/use-speak-on-the-peak";
import { useTypedTransaction } from "@utils/hooks/use-typed-transaction";
import * as React from "react";
const HIDDEN_STYLE_CLASS = "chrome-hidden";

interface Props {
  transactionChange: TransactionChange;
}

const TransactionsComponent: React.FC<Props> = React.memo((props) => {
  const { transactionChange } = props;

  useSpeakOnThePeak(transactionChange.transactions);

  const huasenghengContext = React.useContext(HuasenghengContext);
  huasenghengContext.setTransactions(transactionChange.transactions);

  const [toBuyJSXElements, toSellJSXElements] = useTypedTransaction(
    transactionChange.transactions
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

  const containerStyle: React.CSSProperties = React.useMemo(
    () => ({ display: "flex", flexDirection: "column", rowGap: "0.5rem" }),
    []
  );
  return (
    <div ref={containerRef} className="chrome-fixed" style={containerStyle}>
      <div className={classNameToSell}>{toSellJSXElements}</div>
      <div className={classNameToBuy}>{toBuyJSXElements}</div>
    </div>
  );
});

export default TransactionsComponent;
