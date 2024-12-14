import { readFile, writeFile, getTimeLogger, product } from "../common";
import { Vector2 } from "../common/vector2";
import { make2DGrid, printGrid, toKey } from "../common/grid";

const logTime = getTimeLogger();

var data = readFile("input");

function sToV(s: string) {
  const p = s
    .slice(2)
    .split(",")
    .map((char) => parseInt(char));

  return new Vector2(p[0], p[1]);
}

interface Robot {
  position: Vector2;
  direction: Vector2;
}

const robots: Robot[] = data
  .map((line) => line.split(" "))
  .map((v) => v.map((x) => sToV(x)))
  .map((vv) => {
    return { position: vv[0], direction: vv[1] };
  });

const xMax = 101;
const yMax = 103;

const part1 = undefined;

function advance(robot: Robot, t: number): Vector2 {
  const toMove = robot.direction.scale(t);

  const afterMovement = robot.position.add(toMove);

  const newX = afterMovement.x % xMax;
  const newY = afterMovement.y % yMax;

  const x = newX < 0 ? newX + xMax : newX;
  const y = newY < 0 ? newY + yMax : newY;

  return new Vector2(x, y);
}

const after = robots.map((robot) => advance(robot, 100));

const xCutOff = Math.floor(xMax / 2);
const yCutOff = Math.floor(yMax / 2);

const quad = new Array(4).fill(0);

const result = after.reduce((a, c) => {
  if (c.x < xCutOff && c.y < yCutOff) {
    quad[0] = quad[0] + 1;
  } else if (c.x > xCutOff && c.y < yCutOff) {
    quad[1] = quad[1] + 1;
  } else if (c.x < xCutOff && c.y > yCutOff) {
    quad[2] = quad[2] + 1;
  } else if (c.x > xCutOff && c.y > yCutOff) {
    quad[3] = quad[3] + 1;
  }

  return quad;
}, quad);

console.log({ part1: result.reduce(product) });

logTime("Part 1");

var part2 = 0;
for (var i = 7790; i < 10000; i++) {
  const treeRobots = robots.map((robot) => advance(robot, i));

  const grid = new Map<string, string>();

  treeRobots.map((r) => toKey(r.x, r.y)).forEach((key) => grid.set(key, "#"));

  const f = printGrid(grid, xMax, yMax, false);
  if (f.some((l) => l.match("##########"))) {
    writeFile(`./after-${i.toFixed(3)}`, f);
    part2 = i;
  }
}

console.log({ part2 });

logTime("Part 2");

export {};
