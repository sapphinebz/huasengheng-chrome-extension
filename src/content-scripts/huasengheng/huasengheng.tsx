import TransactionsComponent from "@utils/components/transactions.component";
import * as React from "react";
import { createRoot } from "react-dom/client";
import useContentTransactionChange from "./hooks/use-content-transaction-change";
import HuasenghengCurrentPrice from "@utils/components/huasengheng-current-price";

const container = document.createElement("div");
document.body.append(container);

if (container) {
  const root = createRoot(container);
  root.render(<Huasengheng></Huasengheng>);
}

function Huasengheng() {
  const transactionChange = useContentTransactionChange();
  return (
    <>
      <TransactionsComponent
        transactionChange={transactionChange}
      ></TransactionsComponent>
      <HuasenghengCurrentPrice
        transactionChanged={transactionChange}
      ></HuasenghengCurrentPrice>
    </>
  );
}
