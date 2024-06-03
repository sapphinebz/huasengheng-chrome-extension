import { useContext, useEffect, useState, useCallback } from "react";
import { HuasenghengContext } from "../contexts/huasengheng.context";
import { TranscationRecord } from "@models/transaction-record.model";

export function useMutedState(transaction: TranscationRecord) {
  const huasenghengContext = useContext(HuasenghengContext);
  const [muted, setMuted] = useState<boolean>(
    () => huasenghengContext.getSnapshot(transaction).muted
  );
  useEffect(() => {
    const subscription = huasenghengContext
      .mutedChanges(transaction)
      .subscribe(setMuted);
    return () => subscription.unsubscribe();
  }, [transaction]);

  const wrappedSetMuted = useCallback((muted: boolean) => {
    huasenghengContext.mute(transaction, muted);
    setMuted(muted);
  }, []);

  return [muted, wrappedSetMuted] as [boolean, (value: boolean) => void];
}
