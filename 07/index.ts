import { readFile, getTimeLogger } from "../common";
import { toKey, asKey } from "../common/grid";

const logTime = getTimeLogger();

var data = readFile("input");

var equations = data.map((line) => {
  const [result, rest] = line.split(":");
  const operands = rest.trim().split(" ");
  return {
    result: parseInt(result),
    operands: operands.map((o) => parseInt(o)),
  };
});

var part2Equations: { result: number; operands: number[] }[] = [];

equations = equations.filter((e) => {
  const product = e.operands.reduce((a, c) => a * c);
  if (product < e.result) {
    part2Equations.push(e);
    return false;
  }
  return true;
});

equations = equations.filter((e) => {
  var achivable = false;
  var operatorMask = 0;
  var operatorMaskLimit = 2 ** (e.operands.length - 1);
  while (operatorMask <= operatorMaskLimit) {
    var workingMask = operatorMask;
    var result = e.operands.reduce((a, c) => {
      var operator = workingMask % 2;
      workingMask = workingMask >> 1;
      if (operator == 1) {
        return a * c;
      } else {
        return a + c;
      }
    });
    if (result == e.result) {
      achivable = true;
      break;
    }
    operatorMask++;
  }
  if (!achivable) {
    part2Equations.push(e);
  }
  return achivable;
});

const part1 = equations.reduce((a, c) => c.result + a, 0);

console.log({ part1 });

logTime("Part 1");

part2Equations = part2Equations.filter((e) => {
  var achivable = false;
  var operatorMask = 0;
  var operatorMaskLimit = 3 ** (e.operands.length - 1);
  while (operatorMask <= operatorMaskLimit) {
    var workingMask = operatorMask;
    var result = e.operands.reduce((a, c) => {
      var operator = workingMask % 3;
      workingMask = Math.floor(workingMask / 3);
      if (operator == 2) {
        return parseInt(`${a}${c}`);
      } else if (operator == 1) {
        return a * c;
      } else {
        return a + c;
      }
    });
    if (result == e.result) {
      achivable = true;
      break;
    }
    operatorMask++;
  }
  if (!achivable) {
    part2Equations.push(e);
  }
  return achivable;
});
const part2 = part1 + part2Equations.reduce((a, c) => c.result + a, 0);
console.log({ part2 });

logTime("Part 2");

export {};
