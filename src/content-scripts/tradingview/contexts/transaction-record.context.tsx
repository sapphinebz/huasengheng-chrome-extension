import { createContext } from "react";
import { TranscationRecord } from "../../../models/transaction-record.model";

interface TransactionRecordContext {
  model: TranscationRecord;
}

export function createTransactionRecordContext(model: TranscationRecord) {
  return {
    model,
  };
}

export const TransactionRecordContext = createContext<TransactionRecordContext>(
  {} as any
);
