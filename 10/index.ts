import { readFile, getTimeLogger } from "../common";
import { toKey, fromKey, getNSEW } from "../common/grid";

const logTime = getTimeLogger();

var data = readFile("input");

const topMap: Map<string, number> = new Map();
const nines: Set<string> = new Set();
const zeros: Set<string> = new Set();
const scores: Map<string, Set<string>> = new Map();

const grid = data.map((line, y) =>
  line.split("").map((char, x) => {
    const value = parseInt(char);
    if (value == 9) {
      nines.add(toKey(x, y));
    }
    if (value == 0) {
      zeros.add(toKey(x, y));
    }
    topMap.set(toKey(x, y), value);
    return value;
  })
);

const yMin = 0;
const yMax = grid.length - 1;
const xMin = 0;
const xMax = grid[0].length - 1;

const countGrid = structuredClone(grid);
for (var i = 0; i < countGrid.length; i++) {
  countGrid[i].fill(0);
}

const inBounds = (x: number, y: number): boolean =>
  x >= xMin && x <= xMax && y >= yMin && y <= yMax;

function step(loc: [number, number], current: number, nine: string) {
  const [x, y] = loc;
  const targetNumber = current - 1;
  getNSEW(x, y)
    .filter(([x1, y1]) => inBounds(x1, y1))
    .forEach(([x1, y1]) => {
      if (grid[y1][x1] == targetNumber) {
        if (!scores.has(toKey(x1, y1))) {
          scores.set(toKey(x1, y1), new Set());
        }
        scores.get(toKey(x1, y1))?.add(nine);
        countGrid[y1][x1] = countGrid[y1][x1] + 1;
        step([y1, x1], targetNumber, nine);
      }
    });
}

nines.forEach((nine) => {
  const [x, y] = fromKey(nine);
  step([x, y], 9, nine);
});

var part1 = 0;

zeros.forEach((zero) => {
  const score1 = scores.get(zero);
  if (!score1) throw "oh no";
  part1 = part1 + score1.size;
});

console.log({ part1 });

logTime("Part 1");

var part2 = 0;
zeros.forEach((zero) => {
  const [y, x] = fromKey(zero);
  const score = countGrid[y][x];
  part2 = part2 + score;
});

console.log({ part2 });

logTime("Part 2");

export {};
