import { useEffect } from "react";
import { Observable } from "rxjs";

export function useSubscription<T>(
  observable: Observable<T>,
  callback: (data: T) => void
) {
  useEffect(() => {
    const subscription = observable.subscribe(callback);
    return subscription.unsubscribe.bind(subscription);
  }, [observable, callback]);
}
