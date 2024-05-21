import { createContext, useContext } from "react";
import {
  BehaviorSubject,
  Subject,
  distinctUntilChanged,
  map,
  mergeMap,
  switchMap,
} from "rxjs";
import { TranscationRecord } from "@models/transaction-record.model";
import { generateTransactionRecordKey } from "../../../utils/generate-transaction-record-key";

const MUTED_DEFAULT = true;

export interface TransactionState {
  key: string;
  muted: boolean;
  diffPrice: number;
}

export function createTransactionsContext() {
  const transactionsState = new BehaviorSubject<TransactionState[]>([]);

  const findState = (key: string) => {
    const state = transactionsState.value;
    return state.find((t) => t.key === key);
  };

  const findAndCreateState = (value: TranscationRecord) => {
    const key = generateTransactionRecordKey(value);
    let state = findState(key);
    if (!state) {
      state = createState({
        key,
        muted: MUTED_DEFAULT,
        diffPrice: value.diffPrice,
      });
    }
    return state;
  };

  const createState = (state: TransactionState) => {
    const prevState = transactionsState.value;
    prevState.push(state);
    transactionsState.next(prevState);
    return state;
  };

  const triggerChanges = () => {
    const prevState = transactionsState.value;
    transactionsState.next(prevState);
  };

  const mute = (model: TranscationRecord) => {
    const state = findAndCreateState(model);
    state.muted = MUTED_DEFAULT;
    triggerChanges();
  };

  const toggleMute = (model: TranscationRecord) => {
    const state = findAndCreateState(model);
    state.muted = !state.muted;
    triggerChanges();
  };

  const setMuted = (model: TranscationRecord, value: boolean) => {
    const state = findAndCreateState(model);
    state.muted = value;
    triggerChanges();
  };

  const isMuted = (model: TranscationRecord) => {
    const key = generateTransactionRecordKey(model);
    const state = findState(key);
    if (state) {
      return state.muted;
    }
    return MUTED_DEFAULT;
  };

  const muteChanges = (model: TranscationRecord) => {
    return transactionsState.pipe(
      map(() => {
        const state = findAndCreateState(model);
        if (state) {
          return state.muted;
        }
        return MUTED_DEFAULT;
      })
    );
  };

  const setDiffPrice = (model: TranscationRecord) => {
    const state = findAndCreateState(model);
    state.diffPrice = model.diffPrice;
    triggerChanges();
  };

  const diffPriceChanges = (model: TranscationRecord) => {
    return transactionsState.pipe(
      map(() => {
        const state = findAndCreateState(model);
        if (state) {
          return state.diffPrice;
        }
        return 0;
      }),
      distinctUntilChanged()
    );
  };

  const getValue = () => {
    return transactionsState.value;
  };

  return {
    getValue,
    mute,
    toggleMute,
    findState,
    isMuted,
    setMuted,
    findAndCreateState,
    muteChanges,
    setDiffPrice,
    diffPriceChanges,
  };
}

export const TransactionsContext = createContext(createTransactionsContext());
