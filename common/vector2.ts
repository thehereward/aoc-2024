export type Vector2 = {
  x: number;
  y: number;
};

export function add(a1: Vector2, a2: Vector2) {
  return {
    y: a1.y + a2.y,
    x: a1.x + a2.x,
  };
}

export function sub(a1: Vector2, a2: Vector2) {
  return {
    y: a1.y - a2.y,
    x: a1.x - a2.x,
  };
}

export function isOrigin(vector: Vector2) {
  return vector.x == 0 && vector.y == 0;
}
