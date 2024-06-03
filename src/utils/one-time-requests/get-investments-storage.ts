import { FocusedTransaction } from "@models/focus-transaction.model";
import { from } from "rxjs";

export function getInvestmentsStorage() {
  return from(
    chrome.runtime.sendMessage<string, FocusedTransaction[]>(
      "get-investments-storage"
    )
  );
}
