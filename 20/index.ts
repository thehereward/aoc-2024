import { readFile, getTimeLogger } from "../common";
import { makeInbounds } from "../common/grid";
import { getCardinal, Vector2 } from "../common/vector2";
import { findShortestRoute } from "../common/a-star";

const logTime = getTimeLogger();

var data = readFile("input");

const maze = data.map((line) => line.split(""));

let start: Vector2, end: Vector2;

maze.forEach((line, y) => {
  line.forEach((char, x) => {
    if (char == "S") {
      start = new Vector2(x, y);
    }
    if (char == "E") {
      end = new Vector2(x, y);
    }
  });
});

start = start!;
end = end!;

const xMin = 0;
const yMin = 0;
const xMax = maze[0].length;
const yMax = maze.length;

const inBounds = makeInbounds(xMin, xMax - 1, yMin, yMax - 1);

function getStart() {
  return start;
}

function fromMap(map: string[][], vector: Vector2): string {
  return map[vector.y][vector.x];
}

function getNext(vec: Vector2) {
  return getCardinal()
    .map((c) => vec.add(c))
    .filter((v) => inBounds(v.x, v.y))
    .filter((v) => fromMap(maze, v) != "#")
    .map((v) => {
      return {
        node: v,
        cost: 1,
      };
    });
}

const answer = findShortestRoute(
  getStart,
  getNext,
  (v) => v.toKey(),
  (v) => v.equals(end)
);

const route = answer.solutions[0].history;

logTime("Found route");
const costToEnd = new Map<string, number>();
route.forEach((v, i) => {
  costToEnd.set(v.toKey(), route.length - i - 1);
});
costToEnd.set(end.toKey(), 0);

logTime("Made cost map");

function runPart(part: 1 | 2) {
  const MAX_SKIP_LENGTH = part == 1 ? 2 : 20;
  const MIN_SAVING = yMax < 20 ? (part == 1 ? 1 : 50) : 100;
  console.log(`Part ${part} | saving ${MIN_SAVING}`);

  const shortCuts = new Map<string, number>();
  route.forEach((r, i) => {
    const rkey = r.toKey();
    const cost = costToEnd.get(rkey)!;

    route
      .slice(i + MIN_SAVING + 1)
      .filter((v) => v.subtract(r).getManhattanDistance() <= MAX_SKIP_LENGTH)
      .forEach((x) => {
        const key = `${rkey} > ${x.toKey()}`;

        const saving =
          cost -
          costToEnd.get(x.toKey())! -
          x.subtract(r).getManhattanDistance();

        if (saving >= MIN_SAVING) {
          shortCuts.set(key, Math.max(saving, shortCuts.get(key) || 0));
        }
      });
  });

  return [...shortCuts];
}

var shortCuts = runPart(1);

console.log({ part1: shortCuts.length });

logTime("Part 1");

var shortCuts = runPart(2);

console.log({ part2: shortCuts.length });

logTime("Part 2");

export {};
