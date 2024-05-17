import { map, share } from "rxjs/operators";

import { distinctTransactions } from "../../utils/distinct-transactions";
import { filterTransactions } from "../../utils/filter-transactions";
import { fromSWMessage } from "../../utils/from-sw-message";
import { speakAtThePeak } from "../../utils/speak-at-the-peak";

import { createRoot } from "react-dom/client";
import React, { useEffect, useState } from "react";

import Transactions from "./components/transactions";
import HuasenghengCurrentPrice from "./components/huasengheng-current-price";
import { filterBadgeText } from "../../utils/filter-badge-text";

const serviceWorkerMSG$ = fromSWMessage({
  keepAliveEvery: 10000,
}).pipe(share());

const transactionChange$ = serviceWorkerMSG$.pipe(
  filterTransactions(),
  distinctTransactions(),
  share()
);

const transactions$ = transactionChange$.pipe(
  map((changes) => changes.transactions),
  speakAtThePeak(),
  share()
);

const badgeTextChange$ = serviceWorkerMSG$.pipe(filterBadgeText(), share());

const container = document.createElement("div");
document.body.append(container);

if (container) {
  const root = createRoot(container);
  root.render(<TradingView></TradingView>);
}

function TradingView() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const subscription = badgeTextChange$.subscribe((changes) => {
      setVisible(changes.badgeText === "ON");
    });
    return () => subscription.unsubscribe();
  }, [badgeTextChange$]);

  return (
    <>
      <Transactions
        visible={visible}
        transactions$={transactions$}
      ></Transactions>
      <HuasenghengCurrentPrice
        visible={visible}
        transactionChange$={transactionChange$}
      ></HuasenghengCurrentPrice>
    </>
  );
}
