export function formatCurrencyWithoutSymbol(curNum: number) {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    // Change style to 'decimal'
  }).format(curNum);
}
