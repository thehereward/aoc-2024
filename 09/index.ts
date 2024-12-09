import { readFile, getTimeLogger } from "../common";
import { toKey, asKey } from "../common/grid";

const logTime = getTimeLogger();

var data = readFile("input");

const line = data[0];
var fileId = 0;

const disk = line
  .split("")
  .map((char) => parseInt(char))
  .flatMap((digit, i) => {
    var result: string[] = new Array(digit);
    if (i % 2 == 1) {
      // free space
      result.fill(".");
    } else {
      // file
      result.fill(fileId.toString());
      fileId++;
    }
    return result;
  });

for (var i = 0; i <= disk.length; i++) {
  if (disk[i] != ".") {
    continue;
  }
  var last: string;
  do {
    last = disk.splice(-1, 1)[0];
  } while (last == ".");
  disk[i] = last;
}

const part1 = disk.reduce((a, c, i) => {
  return a + parseInt(c) * i;
}, 0);

console.log({ part1 });

logTime("Part 1");

fileId = 0;
const disk2 = line
  .split("")
  .map((char) => parseInt(char))
  .map((digit, i) => {
    var result: string[] = new Array(digit);
    if (i % 2 == 1) {
      // free space
      result.fill(".");
    } else {
      // file
      result.fill(fileId.toString());
      fileId++;
    }
    return result;
  });

for (var i = disk2.length - 1; i > 0; i--) {
  const blockToMove = disk2[i];
  if (blockToMove.length == 0 || blockToMove[0] == ".") {
    continue;
  }
  const l = blockToMove.length;
  var moved = false;
  disk2.forEach((empty, ii) => {
    if (ii >= i) {
      return;
    }
    if (moved) {
      return;
    }
    if (empty.length == 0 || empty[0] != "." || empty.length < l) {
      return;
    }
    disk2.splice(i, 1, new Array(l).fill("."));
    disk2.splice(ii, 0, blockToMove);
    empty.splice(0, l);
    moved = true;
  });
}

const part2 = disk2
  .flatMap((c) => c)
  .reduce((a, c, i) => {
    if (c == ".") {
      return a;
    }
    return a + parseInt(c) * i;
  }, 0);

console.log({ part2 });

logTime("Part 2");

export {};

// 90328963761 not the right answer
