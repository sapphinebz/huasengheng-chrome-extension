import { EMPTY, Subject, from, fromEvent, merge } from "rxjs";
import { exhaustMap, mergeMap, switchMap, take, tap } from "rxjs/operators";
import { storageGetTrans } from "../utils/storage-get-trans";
import { storageSetTrans } from "../utils/storage-set-trans";
import { FocusedTransaction } from "../models/focus-transaction.model";
import { FOCUS_TYPE } from "../models/focus-type.model";

const tableEl = document.querySelector<HTMLTableElement>("[data-invest-table]");
const tbodyEl = tableEl?.querySelector<HTMLBodyElement>("tbody");
const templateAddEl = document.querySelector<HTMLTemplateElement>(
  "[data-template-add]"
);
const templateViewEl = document.querySelector<HTMLTemplateElement>(
  "[data-template-view]"
);
const buttonEl = tableEl?.querySelector<HTMLButtonElement>("[data-add-button]");

if (tableEl && templateAddEl && buttonEl && tbodyEl && templateViewEl) {
  const onReload = new Subject<void>();

  merge(storageGetTrans(), onReload.pipe(exhaustMap(() => storageGetTrans())))
    .pipe(
      switchMap((list) => {
        tbodyEl.innerHTML = "";
        return from(list).pipe(
          mergeMap((tran, index) => {
            const fragment = document.importNode(templateViewEl.content, true);
            const rowEl = fragment.querySelector<HTMLTableRowElement>("tr");
            const investorEl =
              fragment.querySelector<HTMLInputElement>("[data-investor]");
            if (investorEl) {
              investorEl.value = tran.owner;
            }
            const priceEl =
              fragment.querySelector<HTMLInputElement>("[data-price]");
            if (priceEl) {
              priceEl.valueAsNumber = tran.price;
            }
            const weightEl =
              fragment.querySelector<HTMLInputElement>("[data-weight]");
            if (weightEl) {
              weightEl.valueAsNumber = tran.weight;
            }
            const typeEl =
              fragment.querySelector<HTMLSelectElement>("[data-type]");
            if (typeEl) {
              typeEl.value = tran.type;
            }
            const removeBtnEl =
              fragment.querySelector<HTMLButtonElement>("[data-remove]");
            tbodyEl.appendChild(fragment);
            if (removeBtnEl) {
              return fromEvent(removeBtnEl, "click").pipe(
                take(1),
                switchMap(() => {
                  if (rowEl) {
                    rowEl.remove();
                  }
                  list.splice(index, 1);
                  return storageSetTrans(list).pipe(
                    tap(() => {
                      onReload.next();
                    })
                  );
                })
              );
            }

            return EMPTY;
          })
        );
      })
    )
    .subscribe();
  fromEvent(buttonEl, "click")
    .pipe(
      mergeMap(() => {
        const fragment = document.importNode(templateAddEl.content, true);
        const rowEl = fragment.querySelector<HTMLTableRowElement>("tr");
        const saveEl = fragment.querySelector<HTMLButtonElement>("[data-save]");
        tbodyEl.appendChild(fragment);
        if (saveEl) {
          return fromEvent(saveEl, "click").pipe(
            switchMap(() => {
              console.log("save");

              const data = {} as FocusedTransaction;
              const ownerEl =
                rowEl?.querySelector<HTMLInputElement>("[data-investor]");
              if (ownerEl) {
                data.owner = ownerEl.value;
              }

              const priceEl =
                rowEl?.querySelector<HTMLInputElement>("[data-price]");
              if (priceEl) {
                data.price = priceEl.valueAsNumber;
              }

              const weightEl =
                rowEl?.querySelector<HTMLInputElement>("[data-weight]");
              if (weightEl) {
                data.weight = weightEl.valueAsNumber;
              }
              const typeEl =
                rowEl?.querySelector<HTMLSelectElement>("[data-type]");
              if (typeEl) {
                data.type = typeEl.value as FOCUS_TYPE;
              }

              return storageGetTrans().pipe(
                switchMap((list) => {
                  list.push(data);
                  return storageSetTrans(list);
                }),
                tap(() => {
                  onReload.next();
                })
              );
            })
          );
        }
        return EMPTY;
      })
    )
    .subscribe();
}
