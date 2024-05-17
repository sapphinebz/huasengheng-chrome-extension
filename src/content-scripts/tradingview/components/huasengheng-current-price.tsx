import React, { useEffect, useMemo, useRef, useState } from "react";
import { Observable } from "rxjs";
import { TransactionChange } from "../../../models/transaction-change.model";
import { makeItMovable } from "../../../utils/make-it-movable";
import { formatCurrencyWithoutSymbol } from "../../../utils/format-currency-without-symbol";

interface ComponentProps {
  transactionChange$: Observable<TransactionChange>;
  visible: boolean;
}
const HuasenghengCurrentPrice: React.FC<ComponentProps> = React.memo(
  (props) => {
    const { transactionChange$ } = props;

    const [transactionChanges, setTransactionChanges] =
      useState<TransactionChange>();

    const buyPrice = useMemo(() => {
      if (transactionChanges) {
        const { huasenghengBuy } = transactionChanges;
        return formatCurrencyWithoutSymbol(huasenghengBuy);
      }
      return "";
    }, [transactionChanges?.huasenghengBuy]);

    const sellPrice = useMemo(() => {
      if (transactionChanges) {
        const { huasenghengSell } = transactionChanges;
        return formatCurrencyWithoutSymbol(huasenghengSell);
      }
      return "";
    }, [transactionChanges?.huasenghengSell]);

    useEffect(() => {
      const subscription = transactionChange$.subscribe((changes) =>
        setTransactionChanges(changes)
      );
      return () => {
        subscription.unsubscribe();
      };
    }, [transactionChange$]);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = containerRef.current;
      if (el) {
        const subscription = makeItMovable(el).subscribe();
        return () => subscription.unsubscribe();
      }
    }, [containerRef]);

    const nodeClassName = useMemo(
      () => (props.visible ? "" : "chrome-hide"),
      [props.visible]
    );

    return (
      <div
        ref={containerRef}
        className={`chrome-hua-fixed chrome-hua-font ${nodeClassName}`}
      >
        <div>
          <div className="chrome-hua-header-buy">รับซื้อ</div>
          <div className="chrome-hua-value-buy">{buyPrice}</div>
        </div>
        <div>
          <div className="chrome-hua-header-sell">ขายออก</div>
          <div className="chrome-hua-value-sell">{sellPrice}</div>
        </div>
      </div>
    );
  }
);
export default HuasenghengCurrentPrice;
