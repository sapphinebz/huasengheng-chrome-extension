import { createContext } from "react";
import { Subject } from "rxjs";

const onReload = new Subject<void>();
export const TransactionsContext = createContext({
  onReload,
  reload: () => onReload.next(),
});
