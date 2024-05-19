import React, {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "../../utils/hooks/use-form";
import { Subject, exhaustMap, switchMap, tap } from "rxjs";
import { storageGetTrans } from "../../utils/storage-get-trans";
import { FocusedTransaction } from "../../models/focus-transaction.model";
import { FOCUS_TYPE } from "../../models/focus-type.model";
import { storageSetTrans } from "../../utils/storage-set-trans";
import { TransactionsContext } from "../contexts/transactions.context";

interface FormRetracement {
  highPrice: number;
  lowPrice: number;
}

interface Props {}

const FiboRetracement: React.FC<Props> = React.memo(() => {
  const form = useForm<FormRetracement>();

  const saveRef = useRef(new Subject<FormRetracement>());

  const context = useContext(TransactionsContext);

  useEffect(() => {
    const onSave$ = saveRef.current;
    const subscription = onSave$
      .pipe(
        exhaustMap((formValue) => {
          const diffPrice = formValue.highPrice - formValue.lowPrice;
          return storageGetTrans().pipe(
            switchMap((list) => {
              const fiboList = [0.236, 0.382, 0.5, 0];
              for (const fibo of fiboList) {
                const data = {} as FocusedTransaction;
                data.type = FOCUS_TYPE.WANT_TO_BUY;
                data.owner = "T";
                let fiboPrice = formValue.lowPrice + diffPrice * fibo;
                fiboPrice = Math.round(fiboPrice / 10) * 10;
                data.price = fiboPrice;
                data.weight = 1;
                list.push(data);
              }
              return storageSetTrans(list).pipe(
                tap(() => {
                  form.reset();
                  context.reload();
                })
              );
            })
          );
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [saveRef, form]);
  const clickSave = useCallback(() => {
    const formValue = form.getRawValue();
    saveRef.current.next(formValue);
  }, [form]);
  return (
    <div className="flex-row" ref={form.formRef as LegacyRef<HTMLDivElement>}>
      <div>
        <h2>Fibo Retracement</h2>
      </div>
      <div>
        <span>High Price:</span>
        <span>
          <input type="number" data-formcontrol-name="highPrice" />
        </span>
      </div>
      <div>
        <span> Low Price: </span>
        <span>
          <input type="number" data-formcontrol-name="lowPrice" />
        </span>
      </div>
      <div>
        <button onClick={clickSave}>save</button>
      </div>
    </div>
  );
});

export default FiboRetracement;
