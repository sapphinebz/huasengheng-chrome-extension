import { Observable } from "rxjs";

export function watchContentChanges(el: HTMLElement) {
  return new Observable<string>((subscriber) => {
    let prevContent = "";
    const callback = () => {
      if (el.innerText !== prevContent) {
        subscriber.next(el.innerText);
        prevContent = el.innerText;
      }
    };
    const mutation = new MutationObserver(callback);
    mutation.observe(el, {
      subtree: true,
      childList: true,
    });
    callback();
    return mutation.disconnect.bind(mutation);
  });
}
