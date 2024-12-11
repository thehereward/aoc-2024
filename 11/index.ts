import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const initialNumbers = data[0].split(" ").map((char) => parseInt(char));
const numberMap: Map<number, number> = new Map();
initialNumbers.forEach((num) => {
  numberMap.set(num, (numberMap.get(num) || 0) + 1);
});
const iterationHistory = [numberMap];

function advance(num: number): number[] {
  if (num == 0) {
    return [1];
  }
  const asString = num.toString();
  if (asString.length % 2 == 0) {
    return [
      asString.slice(0, asString.length / 2),
      asString.slice(asString.length / 2),
    ].map((char) => parseInt(char));
  }
  return [num * 2024];
}

for (var i = 0; i < 75; i++) {
  const lastIter = iterationHistory[i];
  const nextIter: Map<number, number> = new Map();
  lastIter.forEach((count, num) => {
    advance(num).forEach((nextNumber) => {
      nextIter.set(nextNumber, (nextIter.get(nextNumber) || 0) + count);
    });
  });
  iterationHistory.push(nextIter);
}

function sumIteration(index: number) {
  var count = 0;
  iterationHistory.slice(index)[0].forEach((v) => (count = count + v));
  return count;
}

console.log({ part1: sumIteration(25) });

logTime("Part 1");

console.log({ part1: sumIteration(75) });

logTime("Part 2");

export {};
