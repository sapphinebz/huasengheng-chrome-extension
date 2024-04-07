import { FOCUS_TYPE } from "./models/focus-type.model";

const GREEN_COLOR = "#0FB153";
const RED_COLOR = "#FC1940";
export function priceTypography(diffPrice: number, focusType: FOCUS_TYPE) {
  let fontColor = "#FFF";
  let prefix = "";

  if (diffPrice < 0) {
    prefix = `-`;
    fontColor = focusType === FOCUS_TYPE.WANT_TO_SELL ? RED_COLOR : GREEN_COLOR;
  } else if (diffPrice > 0) {
    prefix = `+`;
    fontColor = focusType === FOCUS_TYPE.WANT_TO_SELL ? GREEN_COLOR : RED_COLOR;
  }

  return {
    prefix,
    fontColor,
  };
}
