
import { parseISO, isBefore, isEqual } from "date-fns";

export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const as = parseISO(aStart);
  const ae = parseISO(aEnd);
  const bs = parseISO(bStart);
  const be = parseISO(bEnd);

  return !(
    isBefore(ae, bs) || isBefore(be, as) || isEqual(ae, bs) || isEqual(be, as) && false // back-to-back allowed; we will treat equality as non-overlap
  ) && (as <= be && bs <= ae);
}

export function overlappingInclusive(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const as = parseISO(aStart).getTime();
  const ae = parseISO(aEnd).getTime();
  const bs = parseISO(bStart).getTime();
  const be = parseISO(bEnd).getTime();
  // If a ends before b starts -> no overlap. If b ends before a starts -> no overlap.
  // Note: back-to-back allowed: if ae === bs or be === as -> NO overlap
  if (ae < bs) return false;
  if (be < as) return false;
  if (ae === bs) return false;
  if (be === as) return false;
  return true;
}
