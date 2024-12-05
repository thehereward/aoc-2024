import { readFile, getTimeLogger } from "../common";
import { toKey, getDirections } from "../common/grid";

const logTime = getTimeLogger();

var data = readFile("input");

var type: "PAGE_ORDERING" | "UPDATES" = "PAGE_ORDERING";

const correctOrderings = new Set<string>();
const forbiddenOrderings = new Set<string>();
const updates: string[][] = [];

data.forEach((line) => {
  if (line.length == 0) {
    type = "UPDATES";
    return;
  }
  if (type == "PAGE_ORDERING") {
    correctOrderings.add(line);
    const po = line.split("|");
    forbiddenOrderings.add(toKey(po[1], po[0]));
  } else {
    updates.push(line.split(","));
  }
});

function isUpdatePrintble(_update: string[]) {
  const update = _update.slice();
  var isOkay = true;
  var char: string | undefined;
  while ((char = update.shift()) && isOkay) {
    const rules = update.map((c) => toKey(char, c));
    rules.forEach((rule) => {
      if (forbiddenOrderings.has(rule)) {
        isOkay = false;
      }
    });
  }
  return isOkay;
}

const part1 = updates
  .filter((u) => isUpdatePrintble(u))
  .map((d) => {
    const middle = Math.floor(d.length / 2);
    return parseInt(d[middle]);
  })
  .reduce((a, c) => a + c);

console.log({ part1 });

logTime("Part 1");

const broken = updates.filter((u) => !isUpdatePrintble(u));

broken.forEach((b) => {
  b.sort((a, b) => {
    if (correctOrderings.has(toKey(a, b))) {
      return -1;
    }

    if (correctOrderings.has(toKey(b, a))) {
      return 1;
    }

    return 0;
  });
});

const part2 = broken
  .map((d) => {
    const middle = Math.floor(d.length / 2);
    return parseInt(d[middle]);
  })
  .reduce((a, c) => a + c);

console.log({ part2 });

logTime("Part 2");

export {};
