import { readFile, getTimeLogger } from "../common";
import {
  asKey,
  fromKey,
  get3By3,
  getDiagonals,
  getNSEW,
  toKey,
} from "../common/grid";

const logTime = getTimeLogger();

var data = readFile("input");

const yMin = 0;
const yMax = data.length - 1;
const xMin = 0;
const xMax = data[0].length - 1;

var lines = data.map((line) => line.split(""));

const inBounds = (x: number, y: number): boolean =>
  x >= xMin && x <= xMax && y >= yMin && y <= yMax;

function floodRegion(key: string, regionMap: Map<string, number>) {
  const [y, x] = fromKey(key);
  const type = lines[y][x];
  const neighbours = getNSEW(x, y);

  const matching = neighbours
    .filter(([y, x]) => inBounds(x, y))
    .filter((n) => lines[n[0]][n[1]] == type);

  const perimeter = 4 - matching.length;
  regionMap.set(key, perimeter);
  matching
    .map((m) => asKey(m))
    .filter((k) => !regionMap.has(k))
    .forEach((n) => floodRegion(n, regionMap));
}

const mapList: Map<string, number>[] = [];

for (var y = 0; y <= yMax; y++) {
  for (var x = 0; x <= xMax; x++) {
    if (lines[y][x] != ".") {
      const map = new Map<string, number>();
      mapList.push(map);
      floodRegion(toKey(x, y), map);
      map.forEach((_, k) => {
        const [y1, x1] = fromKey(k);
        lines[y1][x1] = ".";
      });
    }
  }
}

const regions = mapList.map((map, i) => {
  const area = map.size;
  var perimeter = 0;
  map.forEach((v) => (perimeter = perimeter + v));
  return { area, perimeter };
});

const part1 = regions.reduce((a, c) => c.area * c.perimeter + a, 0);
console.log({ part1 });

logTime("Part 1");

const regions2 = mapList.map((map, i) => {
  const area = map.size;
  var corners = 0;
  map.forEach((_, k) => {
    const [y, x] = fromKey(k);
    const [n, s, e, w] = getNSEW(x, y);
    const hasN = map.has(asKey(n));
    const hasS = map.has(asKey(s));
    const hasE = map.has(asKey(e));
    const hasW = map.has(asKey(w));
    const [ne, se, sw, nw] = getDiagonals(x, y);
    const hasNE = map.has(asKey(ne));
    const hasSE = map.has(asKey(se));
    const hasSW = map.has(asKey(sw));
    const hasNW = map.has(asKey(nw));

    if (!hasN && !hasE) {
      corners++;
    }
    if (!hasE && !hasS) {
      corners++;
    }
    if (!hasS && !hasW) {
      corners++;
    }
    if (!hasW && !hasN) {
      corners++;
    }

    if (hasN && hasE && !hasNE) {
      corners++;
    }
    if (hasE && hasS && !hasSE) {
      corners++;
    }
    if (hasS && hasW && !hasSW) {
      corners++;
    }
    if (hasW && hasN && !hasNW) {
      corners++;
    }
  });

  return { area, corners };
});

const part2 = regions2.reduce((a, c) => c.area * c.corners + a, 0);
console.log({ part2 });

logTime("Part 2");

export {};
