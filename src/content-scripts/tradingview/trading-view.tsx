import * as React from "react";
import { createRoot } from "react-dom/client";

import TransactionsComponent from "@utils/components/transactions.component";
import useSWMTransactionChanged from "@utils/hooks/use-swm-transaction-changed";
import HuasenghengCurrentPrice from "@utils/components/huasengheng-current-price";

const container = document.createElement("div");
document.body.append(container);

if (container) {
  const root = createRoot(container);
  root.render(<TradingView></TradingView>);
}

function TradingView() {
  const transactionChanged = useSWMTransactionChanged();
  return (
    <>
      <TransactionsComponent
        transactionChange={transactionChanged}
      ></TransactionsComponent>
      <HuasenghengCurrentPrice
        transactionChanged={transactionChanged}
      ></HuasenghengCurrentPrice>
    </>
  );
}
