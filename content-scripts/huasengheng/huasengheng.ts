import { subscribePriceChannel } from "./subscribe-price-channel";

subscribePriceChannel({
  watchToSell: true,
  focusObj: [
    {
      owner: "THD",
      price: 39690,
      weight: 5,
    },
    {
      owner: "SOW",
      price: 39920,
      weight: 15,
    },
  ],
});
