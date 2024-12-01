function gcd(a: number, b: number) {
  if (a == 0) return b;
  return gcd(b % a, a);
}
export function findGCD(arr: number[]) {
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = gcd(arr[i], result);

    if (result == 1) {
      return 1;
    }
  }
  return result;
}
