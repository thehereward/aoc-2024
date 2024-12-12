export function get3By3(x: number, y: number) {
  return [
    [y, x],
    [y + 1, x],
    [y - 1, x],
    [y, x + 1],
    [y + 1, x + 1],
    [y - 1, x + 1],
    [y, x - 1],
    [y + 1, x - 1],
    [y - 1, x - 1],
  ];
}

export function getNSEW(x: number, y: number) {
  return [
    [y - 1, x], // N
    [y + 1, x], // S
    [y, x + 1], // E
    [y, x - 1], // W
  ];
}

export function getDiagonals(x: number, y: number) {
  return [
    [y - 1, x + 1], // NE
    [y + 1, x + 1], // SE
    [y + 1, x - 1], // SW
    [y - 1, x - 1], // NW
  ];
}

export function getDirections(): [number, number][] {
  return [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
}

export function toKey(x: any, y: any) {
  return `${x}|${y}`;
}

export function fromKey(key: string): number[] {
  const [x, y] = key.split("|").map((c) => parseInt(c));
  return [y, x];
}

export function asKey(point: number[]): string {
  return toKey(point[1], point[0]);
}

export function make2DGrid<T>(xMax: number, yMax: number, fill: T) {
  const grid: Record<string, T> = {};
  for (var yy = -1; yy <= yMax; yy++) {
    for (var xx = -1; xx <= xMax; xx++) {
      grid[toKey(xx, yy)] = fill;
    }
  }
  return grid;
}

export function printGrid(
  grid: Map<string, string>,
  xMax: number,
  yMax: number
) {
  for (var y = 0; y <= yMax; y++) {
    const line: string[] = [];
    for (var x = 0; x <= xMax; x++) {
      line.push(grid.get(toKey(x, y)) || " ");
    }
    console.log(line.join(""));
  }
}
