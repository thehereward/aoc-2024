import { Console, dir, log } from "console";
import { readFile, getTimeLogger, sum } from "../common";
import { makeInbounds } from "../common/grid";
import { Cardinal, getCardinal, Vector2 } from "../common/vector2";
import { findShortestRoute } from "../common/a-star";
import { EOL } from "os";

const logTime = getTimeLogger();

var data = readFile("input");

const numericString = `
7|8|9
4|5|6
1|2|3
 |0|A`;

const directionalString = `
 |^|A
<|v|>
`;

function toGrid(str: string) {
  return str
    .split(EOL)
    .filter((l) => l.length > 0)
    .map((l) => l.split("|"));
}

const numeric = toGrid(numericString);
const directional = toGrid(directionalString);

const makeMap = (grid: string[][]) => {
  const map = new Map<string, Vector2>();
  grid.forEach((l, y) =>
    l.forEach((c, x) => {
      const vec = new Vector2(x, y);
      const val = fromMap(grid, vec);
      map.set(val, vec);
    })
  );
  return map;
};

const nMap = makeMap(numeric);
const dMap = makeMap(directional);

function fromMap(map: string[][], vector: Vector2): string {
  return map[vector.y][vector.x];
}

function permute<T>(arr: T[]): T[][] {
  let result: T[][] = [];
  if (arr.length === 0) return [];
  if (arr.length === 1) return [arr];
  for (let i = 0; i < arr.length; i++) {
    const currentNum = arr[i];
    const remainingNums = arr.slice(0, i).concat(arr.slice(i + 1));
    const remainingNumsPermuted = permute(remainingNums);
    for (let j = 0; j < remainingNumsPermuted.length; j++) {
      const permutedArray = [currentNum].concat(remainingNumsPermuted[j]);
      result.push(permutedArray);
    }
  }
  return result;
}

function findRoute(a: string, b: string) {
  const { x, y } = nMap.get(b)!.subtract(nMap.get(a)!);

  const h = x < 0 ? "<".repeat(Math.abs(x)) : ">".repeat(x);
  const v = y < 0 ? "^".repeat(Math.abs(y)) : "v".repeat(y);
  return permute([h.split(""), v.split("")].flatMap((v) => v));
}

const numericStart = nMap.get("A")!.copy();
const directionalStart = dMap.get("A")!.copy();

type Direction = "^" | "v" | "<" | ">";

function getDir(str: Direction): Vector2 {
  switch (str) {
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

class Robot {
  location: Vector2;
  map: string[][];
  robot: Robot | undefined;
  log: string[] = [];

  inBounds = (): boolean => {
    const xMin = 0;
    const yMin = 0;
    const xMax = this.map[0].length - 1;
    const yMax = this.map.length - 1;
    const inBounds = makeInbounds(xMin, xMax, yMin, yMax);

    return inBounds(this.location.x, this.location.y);
  };
  name: string;

  constructor(name: string, map: string[][], start: Vector2, robot?: Robot) {
    this.location = start;
    this.map = map;
    this.robot = robot;
    this.name = name;
  }

  press(key: DirectionalButton) {
    if (key == "A") {
      this.value();
    } else {
      this.move(key);
    }
  }

  move(str: Direction) {
    this.location = this.location.add(getDir(str));
  }

  value(): string {
    if (this.inBounds()) {
      const key = fromMap(this.map, this.location);
      if (this.robot) {
        this.robot.press(key as DirectionalButton);
      } else {
        this.log.push(key);
      }
      return key;
    } else {
      return "#";
    }
  }

  getLog() {
    return this.log;
  }

  toString(): string {
    return `${this.location.toString()} over ${this.value()}`;
  }
}

type DirectionalButton = Direction | "A";

var output: string[] = [];

const getRobotMap = () => {
  const N = "<A";
  const S = "<vA";
  const E = "vA";
  const W = "v<<A";

  const NA = `${N}>A`;
  const SA = `${S}^>A`;
  const EA = `${E}^A`;
  const WA = `${W}>>^A`;
  const A = "A";

  const robot2Map = new Map<
    DirectionalButton,
    Map<DirectionalButton, string>
  >();
  const robot2AMap = new Map<DirectionalButton, string>();
  robot2AMap.set("^", "v<<A>>^A");
  robot2AMap.set("<", "<vA<AA>>^A");
  robot2AMap.set(">", "<vA^>A");
  robot2AMap.set("v", "<vA<A>>^A");
  robot2AMap.set("A", "A");
  robot2Map.set("A", robot2AMap);

  const robot2UpMap = new Map<DirectionalButton, string>();
  robot2UpMap.set("^", "A");
  robot2UpMap.set("<", "v<A<A>>^A");
  robot2UpMap.set(">", "v<A>A^A");
  robot2UpMap.set("v", "v<A^>A");
  robot2UpMap.set("A", EA);
  robot2Map.set("^", robot2UpMap);

  const robot2DownMap = new Map<DirectionalButton, string>();
  robot2DownMap.set("^", NA);
  robot2DownMap.set("<", WA);
  robot2DownMap.set(">", EA);
  robot2DownMap.set("v", A);
  robot2DownMap.set("A", ["vA^<A>A"].join(""));
  robot2Map.set("v", robot2DownMap);

  const robot2RightMap = new Map<DirectionalButton, string>();
  robot2RightMap.set("^", ["<Av<A>>^A"].join(""));
  robot2RightMap.set("<", "v<<AA>>^A");
  robot2RightMap.set(">", A);
  robot2RightMap.set("v", WA);
  robot2RightMap.set("A", [NA].join(""));
  robot2Map.set(">", robot2RightMap);

  const robot2LeftMap = new Map<DirectionalButton, string>();
  robot2LeftMap.set("^", "vA<^A>A");
  robot2LeftMap.set("<", "A");
  robot2LeftMap.set(">", "vAA^A");
  robot2LeftMap.set("v", EA);
  robot2LeftMap.set("A", "vAA^<A>A");
  robot2Map.set("<", robot2LeftMap);
  return robot2Map;
};

const get1TierMap = () => {
  const robot2Map = new Map<
    DirectionalButton,
    Map<DirectionalButton, string[]>
  >();
  const robot2AMap = new Map<DirectionalButton, string[]>();
  robot2AMap.set("^", ["<A"]);
  robot2AMap.set("<", ["v<<A"]);
  robot2AMap.set(">", ["vA"]);
  robot2AMap.set("v", ["<vA"]);
  robot2AMap.set("A", ["A"]);
  robot2Map.set("A", robot2AMap);

  const robot2UpMap = new Map<DirectionalButton, string[]>();
  robot2UpMap.set("^", ["A"]);
  robot2UpMap.set("<", ["v<A"]);
  robot2UpMap.set(">", ["v>A"]);
  robot2UpMap.set("v", ["vA"]);
  robot2UpMap.set("A", [">A"]);
  robot2Map.set("^", robot2UpMap);

  const robot2DownMap = new Map<DirectionalButton, string[]>();
  robot2DownMap.set("^", ["^A"]);
  robot2DownMap.set("<", ["<A"]);
  robot2DownMap.set(">", [">A"]);
  robot2DownMap.set("v", ["A"]);
  robot2DownMap.set("A", ["^>A"]);
  robot2Map.set("v", robot2DownMap);

  const robot2RightMap = new Map<DirectionalButton, string[]>();
  robot2RightMap.set("^", ["<^A"]), robot2RightMap.set("<", ["<<A"]);
  robot2RightMap.set(">", ["A"]);
  robot2RightMap.set("v", ["<A"]);
  robot2RightMap.set("A", ["^A"]);
  robot2Map.set(">", robot2RightMap);

  const robot2LeftMap = new Map<DirectionalButton, string[]>();
  robot2LeftMap.set("^", [">^A"]);
  robot2LeftMap.set("<", ["A"]);
  robot2LeftMap.set(">", [">>A"]);
  robot2LeftMap.set("v", [">A"]);
  robot2LeftMap.set("A", [">>^A"]);
  robot2Map.set("<", robot2LeftMap);
  return robot2Map;
};

const robot2Map = getRobotMap();

function findPath(path: string): string {
  var loc: DirectionalButton = "A";
  var input: string[] = [];
  path
    .split("")
    .map((a) => a as DirectionalButton)
    .forEach((v) => {
      input.push(robot2Map.get(loc)!.get(v)!);
      loc = v;
    });
  return input.join("");
}

const finalRobot = new Robot("final bot", numeric, numericStart.copy());

const robots: Robot[] = [finalRobot];
const NUMBER_OF_ROBOTS = 2;
var lastRobot = finalRobot;
for (var i = 0; i < NUMBER_OF_ROBOTS; i++) {
  lastRobot = new Robot(
    `robot-${i}`,
    directional,
    directionalStart.copy(),
    lastRobot
  );
  robots.push(lastRobot);
}

const tier1Map = get1TierMap();

function toParts(path: string): Map<string, number> {
  const parts = path
    .replaceAll("A", "A,")
    .split(",")
    .filter((l) => l.length > 0);
  const partMap = new Map<string, number>();
  parts.forEach((part) => {
    partMap.set(part, (partMap.get(part) || 0) + 1);
  });
  return partMap;
}

function find1TierPath(parts: Map<string, number>): Map<string, number> {
  const result = new Map<string, number>();
  parts.forEach((v, part) => {
    var loc: DirectionalButton = "A";
    var input: string[][] = [];

    part
      .split("")
      .map((a) => a as DirectionalButton)
      .forEach((char) => {
        input.push(tier1Map.get(loc)!.get(char)!);
        loc = char;
      });
    const partMap = toParts(input.join(""));
    partMap.forEach((value, key) => {
      result.set(key, (result.get(key) || 0) + value * v);
    });
  });
  return result;
}

function followRoute(start: string, route: string[]) {
  var loc = nMap.get(start)!;
  var valid = true;
  route.forEach((char) => {
    loc = loc.add(getDir(char as Direction));
    if (fromMap(numeric, loc) == " ") {
      valid = false;
    }
  });
  return valid;
}

const real = new Map<string, string[]>();
data.forEach((line) => {
  var last = "A";
  var possible = new Set<string>();
  possible.add("");
  line.split("").forEach((char) => {
    const routes = findRoute(last, char).filter((r) => followRoute(last, r));
    last = char;

    const res = new Set<string>();
    routes.forEach((route) => {
      possible.forEach((p) => {
        res.add(p + route.join("") + "A");
      });
    });
    possible = res;
  });
  real.set(line, [...possible]);
});

const part1Answers: number[] = [];
real.forEach((va, k) => {
  var lowestCost = Infinity;
  va.forEach((v) => {
    var humanInput = toParts(v);

    for (var i = 0; i < 2; i++) {
      humanInput = find1TierPath(humanInput);
    }
    var total = 0;
    humanInput.forEach((v, k) => {
      total = total + v * k.length;
    });
    lowestCost = Math.min(lowestCost, total);
  });
  part1Answers.push(lowestCost * parseInt(k.slice(0, 3)));
});

console.log({ part1: part1Answers.reduce(sum) });
logTime("Part 1");

const part2Answers: number[] = [];
real.forEach((va, k) => {
  var lowestCost = Infinity;
  va.forEach((v) => {
    var humanInput = toParts(v);

    for (var i = 0; i < 25; i++) {
      humanInput = find1TierPath(humanInput);
    }
    var total = 0;
    humanInput.forEach((v, k) => {
      total = total + v * k.length;
    });
    lowestCost = Math.min(lowestCost, total);
  });
  part2Answers.push(lowestCost * parseInt(k.slice(0, 3)));
});

console.log({ part2: part2Answers.reduce(sum) });

// 416181745525478 is too high
// 412430699844124 is too high
// 223049209024730 is not the right answer
// 195664513288128 is the right answer
// 162676216670724 is illegal
// 162244939358336 is not the right answer - was illegal
// 160596672031524 is too low -- was illegal

logTime("Part 2");

export {};

// directional --> directional --> directional --> numeric

// +---+---+---+
// | 7 | 8 | 9 |
// +---+---+---+
// | 4 | 5 | 6 |
// +---+---+---+
// | 1 | 2 | 3 |
// +---+---+---+
//     | 0 | A |
//     +---+---+

//     +---+---+
//     | ^ | A |
// +---+---+---+
// | < | v | > |
// +---+---+---+
