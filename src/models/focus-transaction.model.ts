import { FOCUS_TYPE } from "./focus-type.model";
import { WEIGHT_UNIT } from "./weight-unit.model";

export interface FocusedTransaction {
  owner: string;
  price: number;
  weight: number;
  type: FOCUS_TYPE;
  unit?: WEIGHT_UNIT;
}
