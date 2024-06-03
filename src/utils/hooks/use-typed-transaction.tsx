import { FOCUS_TYPE } from "@models/focus-type.model";
import { TranscationRecord } from "@models/transaction-record.model";
import * as React from "react";
import TransactionRecordComponent from "../components/transaction-record.component";

export function useTypedTransaction(transactions: TranscationRecord[]) {
  return React.useMemo(() => {
    const toBuyJSXList: React.JSX.Element[] = [];
    const toSellJSXList: React.JSX.Element[] = [];
    for (const record of transactions) {
      if (record.type === FOCUS_TYPE.WANT_TO_BUY) {
        toBuyJSXList.push(
          <TransactionRecordComponent
            record={record}
          ></TransactionRecordComponent>
        );
      } else if (record.type === FOCUS_TYPE.WANT_TO_SELL) {
        toSellJSXList.push(
          <TransactionRecordComponent
            record={record}
          ></TransactionRecordComponent>
        );
      }
    }
    return [toBuyJSXList, toSellJSXList] as const;
  }, [transactions]);
}
