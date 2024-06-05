import { TranscationRecord } from "@models/transaction-record.model";
import { generateTransactionRecordKey } from "@utils/generate-transaction-record-key";
import { createContext } from "react";
import { BehaviorSubject, OperatorFunction, map } from "rxjs";

const MUTED_DEFAULT = true;

export interface TransactionState extends TranscationRecord {
  muted: boolean;
}

function createState() {
  const stateMap = new Map<string, BehaviorSubject<TransactionState>>();

  const createState = (key: string, transaction: TranscationRecord) => {
    const state = new BehaviorSubject<TransactionState>({
      ...transaction,
      muted: MUTED_DEFAULT,
    });
    stateMap.set(key, state);
    return state;
  };

  const getEntryState = (transaction: TranscationRecord) => {
    const key = generateTransactionRecordKey(transaction);
    const state = stateMap.get(key);
    return [key, state] as const;
  };

  const setTransactions = (transactions: TranscationRecord[]) => {
    for (const transaction of transactions) {
      const [key, state] = getEntryState(transaction);
      if (!state) {
        createState(key, transaction);
      } else {
        const snapshot = state.getValue();
        state.next({ ...snapshot, ...transaction });
      }
    }
  };

  const mute = (transaction: TranscationRecord, muted: boolean) => {
    const [key, state] = getEntryState(transaction);
    if (!state) {
      createState(key, transaction);
    } else {
      state.next({ ...transaction, muted });
    }
  };

  const getSnapshot = (transaction: TranscationRecord) => {
    let [key, state] = getEntryState(transaction);
    if (!state) {
      state = createState(key, transaction);
    }
    return state.value;
  };

  const mutedChanges = (transaction: TranscationRecord) => {
    const [key, state] = getEntryState(transaction);
    const operator: OperatorFunction<TransactionState, boolean> = map(
      (state) => state.muted
    );
    if (!state) {
      return createState(key, transaction).pipe(operator);
    }
    return state.pipe(operator);
  };

  return { setTransactions, mute, mutedChanges, getSnapshot, getEntryState };
}

export const HuasenghengContext = createContext(createState());
