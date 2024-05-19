import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Subject, merge } from "rxjs";
import { concatMap, exhaustMap, switchMap, tap } from "rxjs/operators";
import { FocusedTransaction } from "../../models/focus-transaction.model";
import { storageGetTrans } from "../../utils/storage-get-trans";
import { storageSetTrans } from "../../utils/storage-set-trans";
import InvestmentRow from "./investment-row";
import { TransactionsContext } from "../contexts/transactions.context";

interface Props {}

const InvestmentTable: React.FC<Props> = React.memo(() => {
  const [transactions, setTransactions] = useState<FocusedTransaction[]>([]);
  const context = useContext(TransactionsContext);

  useEffect(() => {
    const subscription = merge(
      storageGetTrans(),
      context.onReload.pipe(exhaustMap(() => storageGetTrans()))
    ).subscribe((list) => {
      setTransactions(list);
    });

    return () => subscription.unsubscribe();
  }, [context]);

  const clickAddRow = useCallback(() => {
    setTransactions((list) => [...list, {} as FocusedTransaction]);
  }, []);

  const deleteRef = useRef(new Subject<FocusedTransaction>());

  useEffect(() => {
    const delete$ = deleteRef.current;
    const subscription = delete$
      .pipe(
        concatMap((model) => {
          return storageGetTrans().pipe(
            switchMap((list) => {
              return storageSetTrans(
                list.filter(
                  (i) =>
                    !(
                      i.price === model.price &&
                      i.owner === model.owner &&
                      i.weight === model.weight
                    )
                )
              ).pipe(tap(() => context.reload()));
            })
          );
        })
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [deleteRef, context]);

  const clickDelete = useCallback(
    (model: FocusedTransaction) => {
      deleteRef.current.next(model);
    },
    [transactions]
  );

  return (
    <>
      <div style={{ paddingTop: "1rem" }}>
        <button onClick={clickAddRow}>Add</button>
      </div>
      <div data-invest-table-container>
        <table data-invest-table>
          <thead>
            <th>Investor</th>
            <th>Price</th>
            <th>Weight</th>
            <th>Type</th>
            <th></th>
          </thead>
          <tbody>
            {transactions.map((tran, index) => {
              return (
                <InvestmentRow
                  key={index}
                  onDelete={clickDelete}
                  model={tran}
                ></InvestmentRow>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default InvestmentTable;
