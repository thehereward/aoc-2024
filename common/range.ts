export function get0To(number: number) {
  return [...Array(number).keys()];
}
export function isInRange(i: number, x1: number, x2: number) {
  if (x1 == x2) {
    return false;
  }
  if (x1 < x2) {
    const answer = i < x2 && i > x1;
    return answer;
  } else {
    const answer = i < x1 && i > x2;
    return answer;
  }
}
