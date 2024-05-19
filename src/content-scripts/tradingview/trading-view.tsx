import React from "react";
import { createRoot } from "react-dom/client";

import HuasenghengCurrentPrice from "./components/huasengheng-current-price";
import Transactions from "./components/transactions";

const container = document.createElement("div");
document.body.append(container);

if (container) {
  const root = createRoot(container);
  root.render(<TradingView></TradingView>);
}

function TradingView() {
  return (
    <>
      <Transactions></Transactions>
      <HuasenghengCurrentPrice></HuasenghengCurrentPrice>
    </>
  );
}
