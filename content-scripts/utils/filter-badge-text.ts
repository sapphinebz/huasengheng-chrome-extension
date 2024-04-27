import { OperatorFunction } from "rxjs";
import { filter } from "rxjs/operators";
export function filterBadgeText(): OperatorFunction<
  any,
  { badgeText: string }
> {
  return filter((event) => "badgeText" in event);
}
