import { readFile, getTimeLogger, sum } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const availableTowels = data[0].split(",").map((s) => s.trim());
const desiredPatterns = data.slice(2);

const ways: Map<string, number> = new Map();

function countWays(pattern: string, availableTowels: string[]): number {
  if (ways.has(pattern)) {
    return ways.get(pattern)!;
  }

  if (pattern.length == 0) {
    ways.set(pattern, 1);
    return 1;
  }

  const numberOfWays = availableTowels
    .filter((towel) => pattern.startsWith(towel))
    .map((towel) => countWays(pattern.slice(towel.length), availableTowels))
    .reduce(sum, 0);
  ways.set(pattern, numberOfWays);
  return numberOfWays;
}

const waysToMake = desiredPatterns.map((p) => countWays(p, availableTowels));
const part1 = waysToMake.filter((c) => c > 0).length;

console.log({ part1 });

logTime("Part 1");

const part2 = waysToMake.reduce(sum);
console.log({ part2 });

logTime("Part 2");

export {};
