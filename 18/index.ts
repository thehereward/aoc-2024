import { readFile, getTimeLogger, assertDefined } from "../common";
import { makeInbounds, toKey } from "../common/grid";
import { getCardinal, Vector2 } from "../common/vector2";
import { findShortestRoute, type NodePlusCost } from "../common/a-star";

const logTime = getTimeLogger();

var data = readFile("input");

const xMin = 0;
const yMin = 0;
const xMax = 70;
const yMax = 70;
const MAX_MEM = 1024;

const inBounds = makeInbounds(xMin, xMax, yMin, yMax);

const start = new Vector2(xMin, yMin);
const end = new Vector2(xMax, yMax);

const bytes = data.map((line) => line.split(",").map((c) => parseInt(c)));

function dropBytes(bytesToDrop: number) {
  const corrupt: Set<string> = new Set();

  for (var i = 0; i < bytesToDrop; i++) {
    const [x, y] = bytes[i];
    corrupt.add(toKey(x, y));
  }
  return corrupt;
}

function getStart() {
  return start.copy();
}

function makeGetNext(obstacles: Set<string>) {
  return function getNext(node: Vector2): NodePlusCost<Vector2>[] {
    return getCardinal()
      .map((n) => node.add(n))
      .filter((n) => inBounds(n.x, n.y))
      .filter((n) => !obstacles.has(n.toKey()))
      .map((n) => {
        return {
          node: n,
          cost: 1,
        };
      });
  };
}

const hash = (node: Vector2): string => node.toKey();

const success = (node: Vector2): boolean => node.equals(end);

const corrupt: Set<string> = dropBytes(MAX_MEM);
const part1 = findShortestRoute(getStart, makeGetNext(corrupt), hash, success);

console.log({ part1 });

logTime("Part 1");

var low = MAX_MEM;
var high = bytes.length;

do {
  var test = Math.floor((high - low) / 2) + low;
  var obstacles = dropBytes(test);
  const shortest = findShortestRoute(
    getStart,
    makeGetNext(obstacles),
    hash,
    success
  );

  if (shortest < Infinity) {
    low = test;
  } else {
    high = test;
  }
} while (low + 1 < high);

console.log({ part2: bytes[low].join(",") });

logTime("Part 2");

export {};
