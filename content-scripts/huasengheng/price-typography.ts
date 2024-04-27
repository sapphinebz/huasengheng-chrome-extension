import { FOCUS_TYPE } from "../models/focus-type.model";
import { FONT_COLOR } from "../models/font-color.model";

export function priceTypography(diffPrice: number, focusType: FOCUS_TYPE) {
  let fontColor: FONT_COLOR = FONT_COLOR.WHITE_COLOR;
  let prefix = "";

  if (diffPrice < 0) {
    fontColor =
      focusType === FOCUS_TYPE.WANT_TO_SELL
        ? FONT_COLOR.RED_COLOR
        : FONT_COLOR.GREEN_COLOR;
  } else if (diffPrice > 0) {
    prefix = `+`;
    fontColor =
      focusType === FOCUS_TYPE.WANT_TO_SELL
        ? FONT_COLOR.GREEN_COLOR
        : FONT_COLOR.RED_COLOR;
  } else {
    fontColor = FONT_COLOR.WHITE_COLOR;
  }

  return {
    prefix,
    fontColor,
  };
}
