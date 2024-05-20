import { TranscationRecord } from "../models/transaction-record.model";

export function generateTransactionRecordKey(record: TranscationRecord) {
  return `${record.owner}${record.price}${record.type}${record.weight}`;
}
