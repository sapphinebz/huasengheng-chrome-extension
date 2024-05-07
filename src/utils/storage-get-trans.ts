import { from } from "rxjs";
import { FocusedTransaction } from "../models/focus-transaction.model";

export function storageGetTrans() {
  return from(
    chrome.storage.local.get("invests").then(({ invests }) => {
      const { list }: { list: FocusedTransaction[] } = invests;
      return list;
    })
  );
}
