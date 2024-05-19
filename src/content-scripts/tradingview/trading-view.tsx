import { map, share } from "rxjs/operators";

import { distinctTransactions } from "../../utils/distinct-transactions";
import { filterTransactions } from "../../utils/filter-transactions";
import { fromSWMessage } from "../../utils/from-sw-message";
import { speakAtThePeak } from "../../utils/speak-at-the-peak";

import { createRoot } from "react-dom/client";
import React, { useContext, useEffect, useState } from "react";

import Transactions from "./components/transactions";
import HuasenghengCurrentPrice from "./components/huasengheng-current-price";
import { filterBadgeText } from "../../utils/filter-badge-text";
import { ServiceWorkerMessagesContext } from "./contexts/service-worker-messages.context";

const container = document.createElement("div");
document.body.append(container);

if (container) {
  const root = createRoot(container);
  root.render(<TradingView></TradingView>);
}

function TradingView() {
  const context = useContext(ServiceWorkerMessagesContext);

  return (
    <>
      <Transactions></Transactions>
      <HuasenghengCurrentPrice></HuasenghengCurrentPrice>
    </>
  );
}
