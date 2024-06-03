import { formatCurrencyWithoutSymbol } from "@utils/format-currency-without-symbol";
import useMovable from "@utils/hooks/use-movable";
import useSWM from "@utils/hooks/use-swm";
import * as React from "react";
import { useMemo } from "react";

interface ComponentProps {}
const HuasenghengCurrentPrice: React.FC<ComponentProps> = React.memo(
  (props) => {
    const transactionChanged = useSWM();

    const buyPrice = useMemo(
      () => formatCurrencyWithoutSymbol(transactionChanged.huasenghengBuy),
      [transactionChanged.huasenghengBuy]
    );

    const sellPrice = useMemo(
      () => formatCurrencyWithoutSymbol(transactionChanged.huasenghengSell),
      [transactionChanged.huasenghengSell]
    );

    const containerRef = useMovable<React.ElementRef<"div">>();

    return (
      <div ref={containerRef} className="chrome-hua-fixed chrome-hua-font">
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
