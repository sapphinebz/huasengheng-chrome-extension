import { WEIGHT_UNIT } from "../huasengheng/models/weight-unit.model";
import { gramToBaht } from "./gram-to-baht";

export function transparentWeight(weight: number, unit?: WEIGHT_UNIT) {
  if (unit === WEIGHT_UNIT.GRAM) {
    return gramToBaht(weight);
  }
  return weight;
}
