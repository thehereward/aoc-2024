import { readFile, getTimeLogger } from "../common";
import { toKey, getDirections } from "../common/grid";

const logTime = getTimeLogger();

var data = readFile("input");

const grid = data.map((line) => line.split(""));

const allChars: Map<string, string> = new Map();
grid.forEach((line, y) => {
  line.forEach((char, x) => {
    allChars.set(toKey(x, y), char);
  });
});

const yMin = 0;
const xMin = 0;
const yMax = grid.length;
const xMax = grid[0].length;

const directions = getDirections();

function findXmas(xStart: number, yStart: number, direction: [number, number]) {
  var y = yStart + direction[0];
  var x = xStart + direction[1];
  if (y < 0 || y >= yMax || x < 0 || x >= xMax) {
    return false;
  }
  const shouldbeM = grid[y][x];
  if (shouldbeM != "M") {
    return false;
  }

  y = y + direction[0];
  x = x + direction[1];
  if (y < 0 || y >= yMax || x < 0 || x >= xMax) {
    return false;
  }
  const shouldbeA = grid[y][x];
  if (shouldbeA != "A") {
    return false;
  }

  y = y + direction[0];
  x = x + direction[1];
  if (y < 0 || y >= yMax || x < 0 || x >= xMax) {
    return false;
  }
  const shouldbeS = grid[y][x];
  if (shouldbeS != "S") {
    return false;
  }

  return true;
}

var count = 0;
for (var y = yMin; y < yMax; y++) {
  for (var x = xMin; x < xMax; x++) {
    const char = grid[y][x];
    if (char != "X") {
      continue;
    }

    directions.forEach((direction) => {
      if (findXmas(x, y, direction)) {
        count++;
      }
    });
  }
}

console.log({ count });

logTime("Part 1");

const correct = new Set(["MMSS", "MSSM", "SSMM", "SMMS"]);

var part2Count = 0;
for (var y = yMin + 1; y < yMax - 1; y++) {
  for (var x = xMin + 1; x < xMax - 1; x++) {
    const char = grid[y][x];
    if (char != "A") {
      continue;
    }

    const chars = [
      grid[y - 1][x - 1],
      grid[y - 1][x + 1],
      grid[y + 1][x + 1],
      grid[y + 1][x - 1],
    ].join("");

    if (correct.has(chars)) {
      part2Count++;
    }
  }
}

console.log({ count: part2Count });

logTime("Part 2");

export {};
