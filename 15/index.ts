import { readFile, getTimeLogger, assertDefined, sum } from "../common";
import { Cardinal, Vector2 } from "../common/vector2";

const logTime = getTimeLogger();

var data = readFile("input");

const mapLines: string[] = [];
const instructionLines: string[] = [];
type Instruction = "<" | ">" | "^" | "v";

var onMap = true;

data.forEach((line) => {
  if (line.length == 0) {
    onMap = false;
    return;
  }

  if (onMap) {
    mapLines.push(line);
  } else {
    instructionLines.push(line);
  }
});

const map = mapLines.map((line) => line.split(""));
const instructions: Instruction[] = instructionLines
  .flatMap((line) => line.split(""))
  .map((c) => c as Instruction);

const part1Instructions = instructions.slice();

let robot: Vector2 = new Vector2(0, 0);
let robotSet = false;

map.forEach((l, y) => {
  if (robotSet) return;
  l.forEach((c, x) => {
    if (robotSet) return;
    if (map[y][x] == "@") {
      robot = new Vector2(x, y);
      robotSet = true;
    }
  });
});

function printMap(map: string[][]) {
  map.forEach((line) => {
    console.log(line.join(""));
  });
}

function getDirection(instruction: Instruction): Vector2 {
  switch (instruction) {
    case "<":
      return Cardinal.W;
    case ">":
      return Cardinal.E;
    case "^":
      return Cardinal.N;
    case "v":
      return Cardinal.S;
  }
}

function fromMap(map: string[][], vector: Vector2): string {
  return map[vector.y][vector.x];
}

function findFirstEmptySpace(
  map: string[][],
  robot: Vector2,
  instruction: Instruction
): undefined | Vector2 {
  const direction = getDirection(instruction);
  var emptyPlace = robot.copy();
  do {
    emptyPlace = emptyPlace.add(direction);
    const what = fromMap(map, emptyPlace);
    if (what == "#") {
      return undefined;
    }
  } while (fromMap(map, emptyPlace) != ".");
  return emptyPlace;
}

function part2FindEmptySpaces(
  map: string[][],
  robot: Vector2,
  instruction: Instruction
): undefined | Vector2[][] {
  const direction = getDirection(instruction);
  var toMove = [robot.copy()];
  var allSpaces: Vector2[][] = [];
  var blocked = false;
  let allEmpty = true;
  do {
    allEmpty = true;
    toMove = toMove
      .map((v) => v.add(direction))
      .map((emptyPlace) => {
        return { place: emptyPlace, value: fromMap(map, emptyPlace) };
      })
      .flatMap((p) => {
        switch (p.value) {
          case "#":
            allEmpty = false;
            blocked = true;
            return [p.place];
          case "[":
            allEmpty = false;
            return [p.place, p.place.add(Cardinal.E)];
          case "]":
            allEmpty = false;
            return [p.place, p.place.add(Cardinal.W)];
          case ".":
          default:
            return [];
        }
      });
    allSpaces.push(toMove);
  } while (!blocked && !allEmpty && toMove.length != 0);
  if (blocked) {
    return undefined;
  }
  return allSpaces;
}

if (robot.x == 0 && robot.y == 0) throw "Help";

part1Instructions.forEach((instruction) => {
  var space = findFirstEmptySpace(map, robot, instruction);
  if (!space) return; // no space, no-op

  const robotsDestination = robot.add(getDirection(instruction));
  map[space.y][space.x] = fromMap(map, robotsDestination);
  map[robotsDestination.y][robotsDestination.x] = "@";
  map[robot.y][robot.x] = ".";
  robot = robotsDestination;
});

const boxes: number[] = [];
map.forEach((l, y) => {
  l.forEach((c, x) => {
    if (c == "O") boxes.push(100 * y + x);
  });
});

console.log({ part1: boxes.reduce(sum) });

logTime("Part 1");

const newMap = mapLines.map((line) =>
  line.split("").flatMap((char) => {
    switch (char) {
      case "#":
        return ["#", "#"];
      case "O":
        return ["[", "]"];
      case "@":
        return ["@", "."];
      case ".":
      default:
        return [".", "."];
    }
  })
);

robotSet = false;
newMap.forEach((l, y) => {
  if (robotSet) return;
  l.forEach((c, x) => {
    if (robotSet) return;
    if (newMap[y][x] == "@") {
      robot = new Vector2(x, y);
      robotSet = true;
    }
  });
});

const part2Instructions = instructions.slice();

part2Instructions.forEach((instruction) => {
  switch (instruction) {
    case "<":
      var space = findFirstEmptySpace(newMap, robot, instruction);
      if (!space) return; // no space, no-op

      for (var x = space.x; x < robot.x; x++) {
        newMap[space.y][x] = newMap[space.y][x + 1];
      }
      newMap[robot.y][robot.x] = ".";
      robot = robot.add(getDirection(instruction));
      break;
    case ">":
      var space = findFirstEmptySpace(newMap, robot, instruction);
      if (!space) return; // no space, no-op

      for (var x = space.x; x > robot.x; x--) {
        newMap[space.y][x] = newMap[space.y][x - 1];
      }
      newMap[robot.y][robot.x] = ".";
      robot = robot.add(getDirection(instruction));
      break;
    case "^":
      var spaces = part2FindEmptySpaces(newMap, robot, instruction);
      if (!spaces) return; // no space, no-op

      spaces.reverse();

      spaces.forEach((space) => {
        space.forEach((s) => {
          const char = fromMap(newMap, s);
          switch (char) {
            case ".":
              return;
            default:
              newMap[s.y - 1][s.x] = char;
              newMap[s.y][s.x] = ".";
          }
        });
      });

      newMap[robot.y][robot.x] = ".";
      robot = robot.add(getDirection(instruction));
      newMap[robot.y][robot.x] = "@";
      break;
    case "v":
      var spaces = part2FindEmptySpaces(newMap, robot, instruction);
      if (!spaces) return; // no space, no-op

      spaces.reverse();

      spaces.forEach((space) => {
        space.forEach((s) => {
          const char = fromMap(newMap, s);
          switch (char) {
            case ".":
              return;
            default:
              newMap[s.y + 1][s.x] = char;
              newMap[s.y][s.x] = ".";
          }
        });
      });

      newMap[robot.y][robot.x] = ".";
      robot = robot.add(getDirection(instruction));
      newMap[robot.y][robot.x] = "@";
      break;
  }

  newMap.forEach((l) =>
    l.forEach((c, i) => {
      if (c == "[" && l[i + 1] != "]") {
        throw "panic";
      }
    })
  );
});

const boxes2: number[] = [];
newMap.forEach((l, y) => {
  l.forEach((c, x) => {
    if (c == "[") boxes2.push(100 * y + x);
  });
});

console.log({ part2: boxes2.reduce(sum) });

logTime("Part 2");

export {};
