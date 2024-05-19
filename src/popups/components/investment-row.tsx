import React, {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FocusedTransaction } from "../../models/focus-transaction.model";
import { Subject, exhaustMap, switchMap, tap } from "rxjs";
import { getInvestmentsStorage } from "../../utils/get-investments-storage";
import { setInvestmentsStorage } from "../../utils/set-investments-storage";
import { useForm } from "../../utils/hooks/use-form";
import { TransactionsContext } from "../contexts/transactions.context";

interface InvestmentRowProps {
  model: FocusedTransaction | null;
  onDelete: (model: FocusedTransaction) => void;
}

const InvestmentRow: React.FC<InvestmentRowProps> = React.memo((props) => {
  const { onDelete } = props;

  const form = useForm<FocusedTransaction>();
  const context = useContext(TransactionsContext);

  const [showSaveButton, setShowSaveButton] = useState(!props.model?.owner);

  useEffect(() => {
    if (props.model?.owner) {
      form.patchValue(props.model);
      form.disableForm();
    } else {
      form.getForm().owner.focus();
    }
  }, [form, props.model]);

  const clickAddRef = useRef(new Subject<FocusedTransaction>());
  useEffect(() => {
    const clickAdd$ = clickAddRef.current;
    const subscription = clickAdd$
      .pipe(
        exhaustMap((model) => {
          return getInvestmentsStorage().pipe(
            switchMap((list) => {
              const newList = list.filter((tran) => Boolean(tran.owner));
              newList.push(model);
              return setInvestmentsStorage(newList).pipe(
                tap(() => {
                  context.reload();
                })
              );
            })
          );
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [clickAddRef]);

  const clickSave = useCallback(() => {
    form.disableForm();
    const formValue = form.getRawValue();
    clickAddRef.current.next(formValue);
    setShowSaveButton(false);
  }, [clickAddRef, form]);

  const clickRemove = useCallback(() => {
    if (props.model) {
      onDelete(props.model);
    }
  }, [props.model]);

  const SaveButton = useMemo(() => {
    if (showSaveButton) {
      return <button onClick={clickSave}>save</button>;
    }
    return null;
  }, [showSaveButton, clickSave]);

  return (
    <tr ref={form.formRef as LegacyRef<HTMLTableRowElement>}>
      <td>
        <input data-formcontrol-name="owner" type="text" />
      </td>
      <td>
        <input data-formcontrol-name="price" type="number" />
      </td>
      <td>
        <input data-formcontrol-name="weight" type="number" />
      </td>
      <td>
        <select data-formcontrol-name="type">
          <option value="sell">want to sell</option>
          <option value="buy">want to buy</option>
        </select>
      </td>
      <td>
        <span style={{ display: "flex", columnGap: "0.5rem" }}>
          <button onClick={clickRemove}>remove</button>
          {SaveButton}
        </span>
      </td>
    </tr>
  );
});

export default InvestmentRow;
