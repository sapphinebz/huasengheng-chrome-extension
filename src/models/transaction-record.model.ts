import { FOCUS_TYPE } from "./focus-type.model";

export interface TranscationRecord {
  owner: string;
  price: number;
  type: FOCUS_TYPE;
  weight: number;
  diffPrice: number;
  totalPrice: number;
}
