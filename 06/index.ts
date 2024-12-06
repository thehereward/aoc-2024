import { readFile, getTimeLogger } from "../common";
import { toKey, asKey } from "../common/grid";

const logTime = getTimeLogger();

var data = readFile("input");

const grid = data.map((line) => line.split(""));

type Direction = "N" | "E" | "S" | "W";

type Guard = {
  location: string;
  x: number;
  y: number;
  direction: Direction;
};

var guard: Guard = {
  location: "",
  direction: "N",
  x: 0,
  y: 0,
};

const yMin = 0;
const yMax = grid.length - 1;
const xMin = 0;
const xMax = grid[0].length - 1;

const obstacles = new Set<string>();

for (var y = yMin; y <= yMax; y++) {
  for (var x = xMin; x <= xMax; x++) {
    const char = grid[y][x];
    const key = toKey(x, y);
    switch (char) {
      case "#":
        obstacles.add(key);
        break;
      case "^":
        guard = {
          location: key,
          direction: "N",
          x: x,
          y: y,
        };
        break;
    }
  }
}

function turn(direction: Direction): Direction {
  switch (direction) {
    case "N":
      return "E";
    case "E":
      return "S";
    case "S":
      return "W";
    case "W":
      return "N";
  }
}

function walk(guard: Guard, obstacles: Set<string>): Guard {
  var { x, y } = guard;
  var newLoc = nextLoc(guard.direction, y, x);
  const [newY, newX] = newLoc;

  const newKey = asKey(newLoc);
  if (obstacles.has(newKey)) {
    return {
      ...guard,
      direction: turn(guard.direction),
    };
  } else {
    return {
      location: newKey,
      direction: guard.direction,
      x: newX,
      y: newY,
    };
  }
}

function run(obstacles: Set<string>, guard: Guard) {
  const locationSet = new Set<string>();
  const historySet = new Set<string>();
  locationSet.add(guard.location);
  historySet.add(`${guard.location}|N`);

  var inLoop: boolean | undefined;

  while (true) {
    guard = walk(guard, obstacles);
    if (guard.y > yMax || guard.y < yMin || guard.x > xMax || guard.x < xMin) {
      inLoop = false;
      break;
    }
    const historyKey = `${guard.location}|${guard.direction}`;
    if (historySet.has(historyKey)) {
      inLoop = true;
      break;
    }
    locationSet.add(guard.location);
    historySet.add(historyKey);
  }

  return { locationSet, inLoop };
}

var { locationSet } = run(obstacles, structuredClone(guard));

console.log({ part1: locationSet.size });

logTime("Part 1");

const specialLocations = new Set<string>();
var counter = 0;
locationSet.forEach((key) => {
  var newObstacles = new Set(obstacles);
  newObstacles.add(key);
  var { inLoop } = run(newObstacles, structuredClone(guard));
  if (inLoop) {
    specialLocations.add(key);
  }
  counter++;
});

console.log({ part2: specialLocations.size });

logTime("Part 2");

export {};

function nextLoc(direction: Direction, y: number, x: number) {
  switch (direction) {
    case "N":
      return [y - 1, x];
    case "E":
      return [y, x + 1];
    case "S":
      return [y + 1, x];
    case "W":
      return [y, x - 1];
  }
}

// 455 is too low
