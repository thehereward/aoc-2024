import { readFile, getTimeLogger } from "../common";
import { solve2DMatrix, Vector2 } from "../common/vector2";

const logTime = getTimeLogger();

var data = readFile("input");

const buttonRegex = /^Button (A|B): X\+(\d+), Y\+(\d+)$/;
const targetRegex = /^Prize: X=(\d+). Y=(\d+)$/;

type Machine = {
  A: Vector2;
  B: Vector2;
  Prize: Vector2;
};

const machines: Machine[] = [];
var machine: Vector2[] = [];

data.forEach((line) => {
  if (line.length == 0) {
    machines.push({
      A: machine[0],
      B: machine[1],
      Prize: machine[2],
    });
    machine = [];
    return;
  }

  const buttonMatch = line.match(buttonRegex);
  if (buttonMatch) {
    machine.push(
      new Vector2(parseInt(buttonMatch[2]), parseInt(buttonMatch[3]))
    );
    return;
  }
  const targetMatch = line.match(targetRegex);
  if (targetMatch) {
    machine.push(
      new Vector2(parseInt(targetMatch[1]), parseInt(targetMatch[2]))
    );
  }
});

function solveMachines(machines: Machine[]) {
  return machines.map((machine, i) => {
    const { A, B, Prize } = machine;

    return solve2DMatrix([A, B], Prize);
  });
}

function solve(machines: Machine[]) {
  var results = solveMachines(machines);

  results = results.filter(
    (r) => Number.isInteger(r.numberOfA) && Number.isInteger(r.numberOfB)
  );

  return results.reduce((a, c) => a + (c.numberOfA * 3 + c.numberOfB), 0);
}

const part1 = solve(machines);
console.log({ part1 });

logTime("Part 1");

const OFFSET = new Vector2(10000000000000, 10000000000000);

machines.forEach((machine) => (machine.Prize = machine.Prize.add(OFFSET)));

const part2 = solve(machines);
console.log({ part2 });

logTime("Part 2");

export {};
