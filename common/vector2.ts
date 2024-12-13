export class Vector2 {
  y: number;
  x: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `${this.x}|${this.y}`;
  }

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  isOrigin(): boolean {
    return this.x == 0 && this.y == 0;
  }
}

export type NESW = "N" | "E" | "S" | "W";

export const Cardinal: Record<NESW, Vector2> = {
  N: new Vector2(0, -1),
  E: new Vector2(+1, 0),
  S: new Vector2(0, +1),
  W: new Vector2(-1, 0),
};

export function solve2DMatrix([A, B]: [Vector2, Vector2], Result: Vector2) {
  const det = A.x * B.y - A.y * B.x;
  if (det == 0) throw `Cannot inverse`;
  const numberOfA = (B.y * Result.x - B.x * Result.y) / det;
  const numberOfB = (A.x * Result.y - A.y * Result.x) / det;
  return { numberOfA, numberOfB };
}
