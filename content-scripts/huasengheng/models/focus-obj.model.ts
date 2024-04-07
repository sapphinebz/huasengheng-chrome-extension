import { FOCUS_TYPE } from "./focus-type.model";

export interface FocusObj {
  owner: string;
  price: number;
  weight: number;
  type: FOCUS_TYPE;
}
