import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

var list1: number[] = [];
var list2: number[] = [];

data.forEach((line) => {
  const [a, b] = line.split("  ");
  list1.push(parseInt(a));
  list2.push(parseInt(b));
});

list1.sort((a, b) => a - b);
list2.sort((a, b) => a - b);

var diffs: number[] = [];
var sumdiff = 0;
for (var i = 0; i < list1.length; i++) {
  var diff = Math.abs(list2[i] - list1[i]);
  diffs.push(diff);
  sumdiff = sumdiff + diff;
}

console.log({ part1: sumdiff });

logTime("Part 1");

const count = new Map<number, number>();

list2.reduce((a, c) => {
  if (count.has(c)) {
    count.set(c, (count.get(c) || 0) + 1);
  } else {
    count.set(c, 1);
  }
  return count;
}, count);

var sumSimilarities = 0;
for (var i = 0; i < list1.length; i++) {
  var similarity = list1[i] * (count.get(list1[i]) || 0);

  sumSimilarities = sumSimilarities + similarity;
}

console.log({ part2: sumSimilarities });

logTime("Part 2");

export {};
