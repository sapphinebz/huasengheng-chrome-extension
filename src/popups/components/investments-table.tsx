import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Subject } from "rxjs";
import { concatMap, switchMap, tap } from "rxjs/operators";
import { FocusedTransaction } from "../../models/focus-transaction.model";
import { getInvestmentsStorage } from "../../utils/get-investments-storage";
import { setInvestmentsStorage } from "../../utils/set-investments-storage";
import InvestmentRow from "./investment-row";
import { TransactionsContext } from "../contexts/transactions.context";
import * as React from "react";
import { FOCUS_TYPE } from "@models/focus-type.model";

interface Props {
  tableType: FOCUS_TYPE;
  transactions: FocusedTransaction[];
}

const InvestmentTable: React.FC<Props> = React.memo((props) => {
  const [transactions, setTransactions] = useState<FocusedTransaction[]>([]);
  const context = useContext(TransactionsContext);

  useEffect(() => {
    setTransactions(props.transactions);
  }, [props.transactions]);

  const clickAddRow = useCallback(() => {
    setTransactions((list) => [...list, {} as FocusedTransaction]);
  }, []);

  const deleteRef = useRef(new Subject<FocusedTransaction>());

  useEffect(() => {
    const delete$ = deleteRef.current;
    const subscription = delete$
      .pipe(
        concatMap((model) => {
          return getInvestmentsStorage().pipe(
            switchMap((list) => {
              return setInvestmentsStorage(
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

  const investmentsRowJSX = React.useMemo(() => {
    return transactions.map((tran, index) => {
      return (
        <InvestmentRow
          type={props.tableType}
          key={index}
          onDelete={clickDelete}
          model={tran}
        ></InvestmentRow>
      );
    });
  }, [transactions, props.tableType, clickDelete]);

  const investmentsTableJSX = React.useMemo(() => {
    if (transactions.length > 0) {
      return (
        <div data-invest-table-container>
          <table data-invest-table>
            <thead>
              <th>Investor</th>
              <th>Price</th>
              <th>Weight</th>
              <th></th>
            </thead>
            <tbody>{investmentsRowJSX}</tbody>
          </table>
        </div>
      );
    }
    return null;
  }, [transactions, investmentsRowJSX]);

  return (
    <>
      <div className="popup-row-container ">
        <span className="popup-header">{props.tableType}</span>
        <button onClick={clickAddRow}>Add</button>
      </div>
      {investmentsTableJSX}
    </>
  );
});

export default InvestmentTable;
