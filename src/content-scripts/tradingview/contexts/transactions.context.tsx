import { createContext } from "react";
import { BehaviorSubject, distinctUntilChanged, map } from "rxjs";
import { TranscationRecord } from "../../../models/transaction-record.model";

export interface TransactionState {
  key: string;
  mute: boolean;
  diffPrice: number;
}

export function createTransactionsContext() {
  const transactionsState = new BehaviorSubject<TransactionState[]>([]);

  const generateKey = (value: TranscationRecord) => {
    return `${value.owner}${value.price}${value.type}${value.weight}`;
  };
  const findState = (key: string) => {
    const state = transactionsState.value;
    return state.find((t) => t.key === key);
  };

  const findAndCreateState = (value: TranscationRecord) => {
    const key = generateKey(value);
    let state = findState(key);
    if (!state) {
      state = createState({
        key,
        mute: true,
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
    state.mute = true;
    triggerChanges();
  };

  const toggleMute = (model: TranscationRecord) => {
    const state = findAndCreateState(model);
    state.mute = !state.mute;
    triggerChanges();
  };

  const setMuted = (model: TranscationRecord, value: boolean) => {
    const state = findAndCreateState(model);
    state.mute = value;
    triggerChanges();
  };

  const muteChanges = (model: TranscationRecord) => {
    return transactionsState.pipe(
      map(() => {
        const state = findAndCreateState(model);
        if (state) {
          return state.mute;
        }
        return true;
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

  return {
    generateKey,
    mute,
    toggleMute,
    findState,
    setMuted,
    findAndCreateState,
    muteChanges,
    setDiffPrice,
    diffPriceChanges,
  };
}

export const TransactionsContext = createContext(createTransactionsContext());
