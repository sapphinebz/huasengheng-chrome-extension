/// <reference types="chrome-types" />
import { FOCUS_TYPE } from "./models/focus-type.model";
import { subscribePriceChannel } from "./subscribe-price-channel";

console.log(chrome.runtime.id);

subscribePriceChannel({
  focusObj: [
    {
      type: FOCUS_TYPE.WANT_TO_SELL,
      owner: "THD",
      price: 39690,
      weight: 5,
    },
    {
      type: FOCUS_TYPE.WANT_TO_SELL,
      owner: "SOW",
      price: 39920,
      weight: 15,
    },
  ],
});
