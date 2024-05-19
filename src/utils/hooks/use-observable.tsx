import { useEffect } from "react";
import { Observable } from "rxjs";

export function useObservable<T>(observable: Observable<T>) {
  useEffect(() => {
    const subscription = observable.subscribe();
    return subscription.unsubscribe.bind(subscription);
  }, [observable]);
}
