import { readFile, getTimeLogger, assertDefined } from "../common";
import { makeInbounds, toKey } from "../common/grid";
import { getCardinal, Vector2 } from "../common/vector2";

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

interface Historians {
  pos: Vector2;
  score: number;
  history: Vector2[];
  predictedScore: number;
}

const historians: Historians = {
  pos: start.copy(),
  score: 0,
  history: [start],
  predictedScore: Infinity,
};

function dropBytes(bytesToDrop: number) {
  const corrupt: Set<string> = new Set();

  for (var i = 0; i < bytesToDrop; i++) {
    const [x, y] = bytes[i];
    corrupt.add(toKey(x, y));
  }
  return corrupt;
}

function copy(historians: Historians): Historians {
  return {
    pos: historians.pos.copy(),
    score: historians.score,
    history: historians.history.slice(),
    predictedScore: historians.predictedScore,
  };
}

function historianToKey(historians: Historians) {
  return historians.pos.toKey();
}

function getNext(historians: Historians): Historians[] {
  const next = getCardinal();
  return next.map((n) => {
    const newPost = historians.pos.add(n);
    return {
      pos: newPost,
      score: historians.score + 1,
      history: historians.history.slice().concat(newPost),
      predictedScore:
        historians.score + 1 + newPost.subtract(end).getManhattanDistance(),
    };
  });
}

function findShortestRoute(start: Historians, obstacles: Set<string>) {
  const minCosts: Map<string, number> = new Map();
  minCosts.set(historianToKey(start), 0);
  var unvisited: Historians[] = [copy(start)];
  var cheapestScore = Infinity;
  do {
    unvisited.sort((a, b) => a.predictedScore - b.predictedScore);

    const current = assertDefined(unvisited.shift());

    const currentKey = historianToKey(current);
    const minCost = assertDefined(minCosts.get(currentKey));
    if (current.score > minCost) continue;

    if (current.pos.equals(end)) {
      cheapestScore = Math.min(current.score, cheapestScore);
      unvisited = unvisited.filter((a) => a.score < cheapestScore);
      continue;
    }
    const next = getNext(current);
    next
      .filter((n) => inBounds(n.pos.x, n.pos.y))
      .filter((n) => !obstacles.has(n.pos.toKey()))
      .filter((n) => {
        const key = historianToKey(n);
        if (!minCosts.has(key)) {
          return true;
        }
        const minCost = minCosts.get(key);
        if (minCost == undefined) throw "panic";
        return minCost > n.score;
      })
      .filter(
        (n) =>
          !unvisited.some((un) => un.pos.equals(n.pos) && un.score <= n.score)
      )
      .forEach((nn) => {
        unvisited.push(nn);
        minCosts.set(nn.pos.toKey(), nn.score);
      });
  } while (unvisited.length > 0);
  return cheapestScore;
}

const corrupt: Set<string> = dropBytes(MAX_MEM);
const part1 = findShortestRoute(historians, corrupt);

console.log({ part1 });

logTime("Part 1");

var low = MAX_MEM;
var high = bytes.length;

do {
  var test = Math.floor((high - low) / 2) + low;
  var obstacles = dropBytes(test);
  const shortest = findShortestRoute(historians, obstacles);

  if (shortest < Infinity) {
    low = test;
  } else {
    high = test;
  }
} while (low + 1 < high);

console.log({ part2: bytes[low].join(",") });

logTime("Part 2");

export {};
