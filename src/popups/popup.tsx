import React from "react";
import { createRoot } from "react-dom/client";
import FiboRetracement from "./components/fibo-retracement";
import IconTradingView from "../utils/components/icon-trading-view";
import InvestmentTable from "./components/investments-table";

const root = createRoot(document.body);
root.render(<App></App>);

function App() {
  return (
    <div>
      <h1>Investments</h1>
      <IconTradingView></IconTradingView>
      <InvestmentTable></InvestmentTable>
      <FiboRetracement></FiboRetracement>
    </div>
  );
}
