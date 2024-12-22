import { readFile, getTimeLogger, sum as intSum } from "../common";

const logTime = getTimeLogger();

var data = readFile("input").map((line) => BigInt(line));

const mix = (a: bigint, b: bigint): bigint => a ^ b;

const prune = (a: bigint): bigint => a % 16777216n;

function nextSecret(a: bigint): bigint {
  var b = a * 64n;
  const c = mix(a, b);
  const d = prune(c);
  const e = d / 32n;
  const f = mix(d, e);
  const g = prune(f);
  const h = g * 2048n;
  const i = mix(g, h);
  const j = prune(i);
  return j;
}

const prices: number[][] = [];

const toPrice = (secret: bigint): number => Number(secret % 10n);

function get2000th(secret: bigint): bigint {
  const price: number[] = [toPrice(secret)];
  for (var i = 0; i < 2000; i++) {
    secret = nextSecret(secret);
    price.push(toPrice(secret));
  }
  prices.push(price);
  return secret;
}

const answers: bigint[] = [];
data.forEach((secret) => {
  const s = get2000th(secret);
  answers.push(s);
});

export const sum = (a: bigint, c: bigint): bigint => a + c;

console.log({ part1: answers.reduce(sum) });

logTime("Part 1");

const priceChanges: number[][] = [];
prices.forEach((price) => {
  const changes: number[] = [];
  for (var i = 1; i < price.length; i++) {
    changes.push(price[i] - price[i - 1]);
  }
  priceChanges.push(changes);
});

const priceMaps: Map<string, number>[] = [];
var cacheHits = 0;

for (var j = 0; j < priceChanges.length; j++) {
  logTime(`processed: ${j} priceChanges`);
  const priceMap: Map<string, number> = new Map();

  for (var i = 0; i < priceChanges[j].length - 3; i++) {
    const sequence = priceChanges[j].slice(i, i + 4);

    const key = sequence.join();
    if (priceMap.has(key)) {
      continue;
    }
    priceMap.set(key, findPrice(j, sequence));
  }
  priceMaps.push(priceMap);
}

const masterMap: Map<string, number> = new Map();
priceMaps.forEach((map) => {
  map.forEach((v, k) => {
    masterMap.set(k, v + (masterMap.get(k) || 0));
  });
});
var bestPrice = -Infinity;
masterMap.forEach((val) => (bestPrice = Math.max(bestPrice, val)));
console.log({ part2: bestPrice });

logTime("Part 2");

export {};

function getBestPrice(sequence: number[]) {
  return priceChanges
    .map((_, index) => findPrice(index, sequence))
    .reduce(intSum);
}

function findPrice(index: number, sequence: number[]) {
  const p = priceChanges[index];
  var price = 0;
  for (var i = 0; i < p.length; i++) {
    if (
      p[i] == sequence[0] &&
      p[i + 1] == sequence[1] &&
      p[i + 2] == sequence[2] &&
      p[i + 3] == sequence[3]
    ) {
      price = prices[index][i + 4];
      break;
    }
  }
  return price;
}

// v1 ran in 285454ms
// v2 ran in   5683ms
