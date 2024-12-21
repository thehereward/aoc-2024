import { dir, log } from "console";
import { readFile, getTimeLogger, sum } from "../common";
import { makeInbounds } from "../common/grid";
import { Cardinal, getCardinal, Vector2 } from "../common/vector2";
import { EOL } from "os";
import { findShortestRoute } from "../common/a-star";
import { isStringLiteralOrJsxExpression } from "typescript";

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

// console.log({ nMap });
// console.log({ dMap });

function toGrid(str: string) {
  return str
    .split(EOL)
    .filter((l) => l.length > 0)
    .map((l) => l.split("|"));
}

function fromMap(map: string[][], vector: Vector2): string {
  return map[vector.y][vector.x];
}

const makeBounds = (grid: string[][]) => {
  const xMin = 0;
  const yMin = 0;
  const xMax = grid[0].length - 1;
  const yMax = grid.length - 1;
  const inBounds = makeInbounds(xMin, xMax, yMin, yMax);

  return (vector: Vector2): boolean => {
    return inBounds(vector.x, vector.y) && fromMap(grid, vector) != " ";
  };
};

const numericStart = nMap.get("A")!.copy();
const directionalStart = dMap.get("A")!.copy();

const isNBounds = makeBounds(numeric);
const isDBounds = makeBounds(directional);

const first = data[0].split("");

function findRoute(
  start: Vector2,
  end: Vector2,
  inBounds: (vec: Vector2) => boolean
) {
  function getNextN(vector: Vector2) {
    return getCardinal()
      .map((c) => c.add(vector))
      .filter((v) => inBounds(v))
      .map((n) => {
        return {
          node: n,
          cost: 1,
        };
      });
  }

  return findShortestRoute(
    () => start.copy(),
    getNextN,
    (v: Vector2) => v.toKey(),
    (v: Vector2) => v.equals(end)
  );
}

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

  inBounds = (): boolean => {
    const xMin = 0;
    const yMin = 0;
    const xMax = this.map[0].length - 1;
    const yMax = this.map.length - 1;
    const inBounds = makeInbounds(xMin, xMax, yMin, yMax);

    return inBounds(this.location.x, this.location.y);
  };

  constructor(map: string[][], start: Vector2) {
    this.location = start;
    this.map = map;
  }

  move(str: Direction) {
    this.location = this.location.add(getDir(str));
  }

  value(): string {
    if (this.inBounds()) {
      return fromMap(this.map, this.location);
    } else {
      return "#";
    }
  }

  toString(): string {
    return `${this.location.toString()} over ${this.value()}`;
  }
}

const robot1 = new Robot(directional, directionalStart.copy());
const robot2 = new Robot(directional, directionalStart.copy());
const robot3 = new Robot(numeric, numericStart.copy());

type DirectionalButton = Direction | "A";
type NumericalButton = string;

var output: string[] = [];

function pressButton(str: DirectionalButton) {
  if (str == "A") {
    const val = robot1.value();
    pressButton2(val as DirectionalButton);
  } else {
    robot1.move(str);
  }
  //   console.log(`Robot 1: ${robot1.toString()}`);
}

function pressButton2(str: DirectionalButton) {
  if (str == "A") {
    const val = robot2.value();
    pressButton3(val as DirectionalButton);
    // console.log(`Robot 2 pressed: ${val}`);
  } else {
    robot2.move(str);
  }
  //   console.log(`Robot 2: ${robot2.toString()}`);
}

function pressButton3(str: DirectionalButton) {
  if (str == "A") {
    const val = robot3.value();
    output.push(val);
    // console.log(`OUTPUT: ${val}`);
  } else {
    robot3.move(str);
  }
  //   console.log(`Robot 3: ${robot3.toString()}`);
}

// HUMAN --> 2nd ROBOT
// A to...
// ^  8 v<<A>>^A
// < 10 <vA<AA>>^A
// >  6 <vA^>A
// v  9 <vA<A>>^A
// A  1 A

// ^ to...
// ^  1 A
// <  9 v<A<A>>^A
// >  7 v<A>A^A
// v    v<A^>A
// A  1 vA^A

const N = "<A";
const S = "<vA";
const E = "vA";
const W = "v<<A";

const NA = `${N}>A`;
const SA = `${S}^>A`;
const EA = `${E}^A`;
const WA = `${W}>>^A`;
const A = "A";

const robot2Map = new Map<DirectionalButton, Map<DirectionalButton, string>>();
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
robot2DownMap.set("A", ["vA^", NA].join(""));
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

const test = new Map<string, string>();
test.set("029A", "<A^A^^>AvvvA");
test.set("980A", "^^^A<AvvvA>A");
test.set("179A", "^<<A^^A>>AvvvA");
test.set("456A", "^^<<A>A>AvvA");
test.set("379A", "^A<<^^A>>AvvvA");

var testAnswers: number[] = [];

test.forEach((v, k) => {
  output = [];
  const humanInput = findPath(v);
  // console.log("h 1 2 3");
  // console.log(`  ${robot1.value()} ${robot2.value()} ${robot3.value()}`);
  humanInput.split("").forEach((s) => {
    pressButton(s as DirectionalButton);
  });
  //   console.log(k);
  //   console.log(output.join(""));
  //   console.log(humanInput.length);
  testAnswers.push(humanInput.length * parseInt(k.slice(0, 3)));
});

// console.log(testAnswers.reduce(sum));

const real = new Map<string, string>();
// real.set("208A", "^<AvA^^^A>vvvA");
real.set("208A", "<^AvA^^^Avvv>A");
real.set("586A", "<^^A^Av>AvvA");
real.set("341A", "^A<<^AvA>>vA");
real.set("463A", "^^<<A>>AvAvA");
real.set("593A", "<^^A>^AvvAvA");

const part1Answers: number[] = [];
real.forEach((v, k) => {
  output = [];
  const humanInput = findPath(v);
  // console.log("h 1 2 3");
  // console.log(`  ${robot1.value()} ${robot2.value()} ${robot3.value()}`);
  humanInput.split("").forEach((s) => {
    pressButton(s as DirectionalButton);
  });
  //   console.log(k);
  //   console.log(output.join(""));
  //   console.log(humanInput.length);
  part1Answers.push(humanInput.length * parseInt(k.slice(0, 3)));
});

console.log({ part1: part1Answers.reduce(sum) });

// const t = findRoute(nMap.get(first[1])!, nMap.get(first[2])!, isNBounds);
// console.log(t.solutions.length);

// console.log(first);

logTime("Part 1");

logTime("Part 2");

export {};

// directional --> directional --> directional --> numeric

// 0 <>A
//

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

//        0   2       9       A
//    <   A ^ A >  ^^ A  vvv  A
//    <   A ^ A >  ^^ A  vvv  A
// v<<A>>^A<A>AvA<^AA>A<vAAA>^A

// 029A: <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
// rob1: ^vv<<<v>AA
// rob2: AA>>v<<<<<
// rob3: AAAAAAAAA0

// 029A:  v<<A>>^A
// rob1: A>v<<v>AA
// rob2: AAAA^^^^^
// rob3: AAAAAAAA3
