import { readFile, getTimeLogger, assertDefined, sum } from "../common";
import { Cardinal, Vector2 } from "../common/vector2";
import { fromKey, getNSEW, printGrid } from "../common/grid";

const logTime = getTimeLogger();

const COST_MOVE = 1;
const COST_TURN = 1000;

var data = readFile("input");

const maze = data.map((line) => line.split(""));

let start, end: Vector2;
const startDirection = Cardinal.E;

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

interface Deer {
  pos: Vector2;
  dir: Vector2;
  score: number;
  history: Vector2[];
  predictedScore: number;
}

var tilesRemoved = 0;
do {
  var changed = false;
  maze.forEach((line, y) => {
    line.forEach((char, x) => {
      if (char == "S") {
        return;
      }
      if (char == "E") {
        return;
      }
      if (char == "#") {
        return;
      }
      if (
        getNSEW(x, y)
          .map(([y, x]) => maze[y][x])
          .filter((char) => char == "#").length == 3
      ) {
        maze[y][x] = "#";
        changed = true;
        tilesRemoved++;
      }
    });
  });
} while (changed);

logTime("Removing tiles");

function printMap(map: string[][]) {
  map.forEach((line) => {
    console.log(line.join(""));
  });
}

const JOIN = "#";

function toKey(deer: Deer) {
  return `${deer.pos.toString()}${JOIN}${deer.dir.toString()}`;
}

if (!start) throw "Start not found";

const deer: Deer = {
  pos: start,
  dir: startDirection,
  score: 0,
  history: [start],
  predictedScore: Infinity,
};

function copy(deer: Deer): Deer {
  return {
    pos: deer.pos.copy(),
    dir: deer.dir.copy(),
    score: deer.score,
    history: deer.history.slice(),
    predictedScore: deer.predictedScore,
  };
}

function toString(deer: Deer) {
  return `${deer.pos.toString()} ${deer.dir.toString()} ${deer.score}`;
}

const minCosts: Map<string, number> = new Map();
minCosts.set(toKey(deer), 0);

function getNext(deer: Deer): Deer[] {
  return [
    {
      pos: deer.pos.add(deer.dir),
      dir: deer.dir.copy(),
      score: deer.score + 1,
      history: deer.history.slice().concat(deer.pos.add(deer.dir)),
      predictedScore:
        deer.score +
        COST_MOVE +
        end.subtract(deer.pos.add(deer.dir)).getManhattanDistance() +
        COST_TURN +
        (deer.dir.equals(Cardinal.S) ? COST_TURN : 0) +
        (deer.dir.equals(Cardinal.W) ? COST_TURN : 0),
    },
    {
      pos: deer.pos.copy(),
      dir: deer.dir.rotateRight(),
      score: deer.score + COST_TURN,
      history: deer.history.slice(),
      predictedScore: deer.predictedScore + COST_TURN,
    },
    {
      pos: deer.pos.copy(),
      dir: deer.dir.rotateLeft(),
      score: deer.score + COST_TURN,
      history: deer.history.slice(),
      predictedScore: deer.predictedScore + COST_TURN,
    },
  ];
}

const bestSeats: Set<string> = new Set();

function addToBestSeats(final: Deer) {
  final.history.map((h) => h.toKey()).forEach((k) => bestSeats.add(k));
}

var unvisited: Deer[] = [copy(deer)];
var cheapestScore = Infinity;
do {
  unvisited.sort((a, b) => a.predictedScore - b.predictedScore);
  const current = unvisited.shift();

  if (!current) throw "Panic";
  if (current.score > cheapestScore) continue;
  const currentKey = toKey(current);
  const minCost = minCosts.get(currentKey);
  const currentCheapestScore = minCost == undefined ? Infinity : minCost;
  if (current.score > currentCheapestScore) continue;

  minCosts.set(currentKey, current.score);

  if (fromMap(maze, current.pos) == "E") {
    if (current.score < cheapestScore) {
      bestSeats.clear();
    }
    if (current.score <= cheapestScore) {
      addToBestSeats(current);
    }
    cheapestScore = Math.min(current.score, cheapestScore);
    continue;
  }
  const next = getNext(current);
  next
    .filter((n) => fromMap(maze, n.pos) != "#")
    .filter((n) => {
      const key = toKey(n);
      if (minCosts.has(key)) {
        const minCost = minCosts.get(key);
        if (minCost == undefined) throw "panic";
        return minCost > n.score;
      } else {
        return true;
      }
    })
    .forEach((nn) => {
      unvisited.push(nn);
    });
} while (unvisited.length > 0);

function fromMap(map: string[][], vector: Vector2): string {
  return map[vector.y][vector.x];
}

console.log({ part1: cheapestScore });

logTime("Part 1");

bestSeats.forEach((value) => {
  const [y, x] = fromKey(value);
  maze[y][x] = "O";
});

console.log({ part2: bestSeats.size });

logTime("Part 2");

export {};
