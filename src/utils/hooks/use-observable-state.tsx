import { Observable } from "rxjs";
import { useState } from "react";
import { useSubscription } from "./use-subscription";

export function useObservableState<T>(
  observable: Observable<T>,
  defaultValue: T
) {
  const operations = useState(defaultValue);
  useSubscription(observable, operations[1]);
  return operations;
}
