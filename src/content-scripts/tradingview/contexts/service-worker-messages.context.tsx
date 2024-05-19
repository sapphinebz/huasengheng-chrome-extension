import { createContext } from "react";
import { connectable, map, share } from "rxjs";
import { distinctTransactions } from "../../../utils/distinct-transactions";
import { filterTransactions } from "../../../utils/filter-transactions";
import { fromSWMessage } from "../../../utils/from-sw-message";
import { filterBadgeText } from "../../../utils/filter-badge-text";

const serviceWorkerMSG$ = connectable(
  fromSWMessage({
    keepAliveEvery: 10000,
  })
);

serviceWorkerMSG$.connect();

const transactionChanged = serviceWorkerMSG$.pipe(
  filterTransactions(),
  distinctTransactions(),
  share()
);

const badgeTextChanged = serviceWorkerMSG$.pipe(filterBadgeText(), share());

const visibilityChanged = badgeTextChanged.pipe(
  map((changes) => changes.badgeText === "ON"),
  share()
);

export const ServiceWorkerMessagesContext = createContext({
  transactionChanged,
  badgeTextChanged,
  visibilityChanged,
});
