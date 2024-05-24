import * as React from "react";
import { createRoot } from "react-dom/client";
import FiboRetracement from "./components/fibo-retracement";
import IconTradingView from "../utils/components/icon-trading-view";
import InvestmentTable from "./components/investments-table";
import { exhaustMap, merge } from "rxjs";
import { getInvestmentsStorage } from "@utils/get-investments-storage";
import { TransactionsContext } from "./contexts/transactions.context";
import { FocusedTransaction } from "@models/focus-transaction.model";
import { FOCUS_TYPE } from "@models/focus-type.model";

const root = createRoot(document.body);
root.render(<App></App>);

function App() {
  const context = React.useContext(TransactionsContext);
  const [toSellTransactions, setToSellTransactions] = React.useState<
    FocusedTransaction[]
  >([]);
  const [toBuyTransactions, setToBuyTransactions] = React.useState<
    FocusedTransaction[]
  >([]);
  React.useEffect(() => {
    const subscription = merge(
      getInvestmentsStorage(),
      context.onReload.pipe(exhaustMap(() => getInvestmentsStorage()))
    ).subscribe((list) => {
      list.sort((a, b) => b.price - a.price);
      const toSell: FocusedTransaction[] = [];
      const toBuy: FocusedTransaction[] = [];
      for (const record of list) {
        if (record.type === FOCUS_TYPE.WANT_TO_SELL) {
          toSell.push(record);
        } else if (record.type === FOCUS_TYPE.WANT_TO_BUY) {
          toBuy.push(record);
        }
      }
      setToSellTransactions(toSell);
      setToBuyTransactions(toBuy);
    });

    return () => subscription.unsubscribe();
  }, [context]);

  return (
    <div>
      <h1>Investments</h1>
      <IconTradingView></IconTradingView>
      <InvestmentTable
        tableType={FOCUS_TYPE.WANT_TO_SELL}
        transactions={toSellTransactions}
      ></InvestmentTable>
      <InvestmentTable
        tableType={FOCUS_TYPE.WANT_TO_BUY}
        transactions={toBuyTransactions}
      ></InvestmentTable>
      <FiboRetracement></FiboRetracement>
    </div>
  );
}
