import { readFile, getTimeLogger } from "../common";
import { toKey, asKey } from "../common/grid";
import { add, isOrigin, sub, type Vector2 } from "../common/vector2";

const logTime = getTimeLogger();

var data = readFile("input");

const grid = data.map((line) => line.split(""));

const yMin = 0;
const yMax = grid.length - 1;
const xMin = 0;
const xMax = grid[0].length - 1;

const inBounds = (node: Vector2): boolean =>
  node.x >= xMin && node.x <= xMax && node.y >= yMin && node.y <= yMax;

type Antenna = {
  frequency: string;
  x: number;
  y: number;
};

const antennas: Antenna[] = [];
const frequencies = new Set<string>();
const antinodes1: Vector2[] = [];
const antinodes2: Vector2[] = [];

grid.forEach((line, y) =>
  line.forEach((char, x) => {
    if (char != ".") {
      antennas.push({
        frequency: char,
        x,
        y,
      });
      frequencies.add(char);
    }
  })
);

frequencies.forEach((frequency) => {
  antennas
    .filter((a) => a.frequency == frequency)
    .forEach((a1) => {
      antennas
        .filter((a) => a.frequency == frequency)
        .forEach((a2) => {
          var diff: Vector2 = sub(a2, a1);
          if (isOrigin(diff)) {
            return;
          }
          // Part 1
          if (!isOrigin(diff)) {
            antinodes1.push(sub(a1, diff));
          }

          // Part 2
          var antinode: Vector2 = structuredClone(a1);
          while (true) {
            antinode = sub(antinode, diff);
            if (!inBounds(antinode)) {
              break;
            } else {
              antinodes2.push(antinode);
            }
          }
          antinode = structuredClone(a1);
          while (true) {
            antinode = add(antinode, diff);
            if (!inBounds(antinode)) {
              break;
            } else {
              antinodes2.push(antinode);
            }
          }
        });
    });
});

const nodeSet = new Set<string>();
antinodes1
  .filter(inBounds)
  .forEach((node) => nodeSet.add(toKey(node.x, node.y)));

console.log(nodeSet.size);

logTime("Part 1");

nodeSet.clear();

antinodes2
  .filter(inBounds)
  .forEach((node) => nodeSet.add(toKey(node.x, node.y)));

console.log(nodeSet.size);

logTime("Part 2");

export {};
