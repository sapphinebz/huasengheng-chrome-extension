import { from } from "rxjs";
import { FocusedTransaction } from "../models/focus-transaction.model";

export function storageSetTrans(list: FocusedTransaction[]) {
  return from(
    chrome.storage.local.set({
      invests: {
        list: list,
      },
    })
  );
}
