import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");
const lines = data.join("");

const result = execute(lines);

console.log({ result });

logTime("Part 1");

const result2 = execute(
  lines.replaceAll(/don't\(\).*?(?=(do\(\)|don't\(\)|$))/g, "")
);
console.log({ result2 });

logTime("Part 2");

export {};

function execute(_lines: string) {
  const regex = /mul\(\d+,\d+\)/g;
  const mulMatches = _lines.matchAll(regex);

  const muls: string[] = [];

  mulMatches.forEach((mm: string[]) => muls.push(mm[0]));

  const operandCaptureRegex = /mul\((\d+),(\d+)\)/;

  const r = muls.map((mul) => {
    const m = mul.match(operandCaptureRegex);
    if (!m) {
      return 0;
    }
    return parseInt(m[1]) * parseInt(m[2]);
  });

  return r.reduce((a, c) => a + c);
}

// 87640588 was wrong
// 12618099 was wrong // assumed don'ts were always followed by do's
// 11227186 was wrong // missed the last don't before the end of the program
//  2389812 was wrong // my regex was too greedy

// 78683433 was correct
