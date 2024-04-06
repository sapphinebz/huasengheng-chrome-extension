export function priceTypography(diffPrice: number) {
  let fontColor = "#FFF";
  let prefix = "";

  if (diffPrice < 0) {
    prefix = `-`;
    fontColor = "#FC1940";
  } else if (diffPrice > 0) {
    prefix = `+`;
    fontColor = "#0FB153";
  }

  return {
    prefix,
    fontColor,
  };
}
