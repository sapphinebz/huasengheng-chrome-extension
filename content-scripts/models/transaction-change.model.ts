import { TranscationRecord } from "./transaction-record.model";

export interface TransactionChange {
  huasenghengSell: number;
  huasenghengBuy: number;
  transactions: TranscationRecord[];
}
