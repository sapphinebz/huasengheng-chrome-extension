/// <reference types="chrome-types" />
import { subscribePriceChannel } from "./subscribe-price-channel";

subscribePriceChannel({
  focusObj: [
    {
      type: "wantToSell",
      owner: "THD",
      price: 39690,
      weight: 5,
    },
    {
      type: "wantToSell",
      owner: "SOW",
      price: 39920,
      weight: 15,
    },
  ],
});
