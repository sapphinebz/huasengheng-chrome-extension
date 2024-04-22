export function formatCurrencyWithoutSymbol(curNum: number) {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
    // Change style to 'decimal'
  }).format(curNum);
}
