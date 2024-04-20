import { Observable } from "rxjs";

export function watchUntilExist<T>(period: number, query: () => T) {
  return new Observable<NonNullable<T>>((subscriber) => {
    const callback = () => {
      const rest = query();
      if (rest) {
        subscriber.next(rest);
        subscriber.complete();
      }
    };
    const ref = setInterval(callback, period);
    callback();

    return () => {
      clearInterval(ref);
    };
  });
}
