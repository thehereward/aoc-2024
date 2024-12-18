import { assertDefined } from ".";

export interface NodePlusCost<T> {
  node: T;
  cost: number;
  heuristic?: number;
}

interface CostedNode<T> {
  pos: T;
  score: number;
  history: T[];
  predictedScore: number;
}

export function findShortestRoute<T>(
  getStart: () => T,
  getNext: (node: T) => NodePlusCost<T>[],
  hash: (node: T) => string,
  testSuccess: (node: T) => boolean
) {
  const start = getStart();

  const costedNode: CostedNode<T> = {
    pos: start,
    score: 0,
    history: [start],
    predictedScore: Infinity,
  };
  const minCosts: Map<string, number> = new Map();
  minCosts.set(hash(costedNode.pos), 0);

  var unvisited: CostedNode<T>[] = [costedNode];
  var lowestCost = Infinity;
  do {
    unvisited.sort((a, b) => a.predictedScore - b.predictedScore);

    const current = assertDefined(unvisited.shift());

    const currentKey = hash(current.pos);
    const minCost = assertDefined(minCosts.get(currentKey));
    if (current.score > minCost) continue;

    if (testSuccess(current.pos)) {
      lowestCost = Math.min(current.score, lowestCost);
      unvisited = unvisited.filter((a) => a.score < lowestCost);
      continue;
    }
    const next = getNext(current.pos);
    next
      .map((n) => {
        return {
          ...current,
          pos: n.node,
          score: current.score + n.cost,
          predictedScore: current.score + n.cost + (n.heuristic || 0),
        };
      })
      .filter((n) => {
        const key = hash(n.pos);
        if (!minCosts.has(key)) {
          return true;
        }
        const minCost = minCosts.get(key);
        if (minCost == undefined) throw "panic";
        return minCost > n.score;
      })
      .filter(
        (n) =>
          !unvisited.some(
            (un) => hash(un.pos) == hash(n.pos) && un.score <= n.score
          )
      )
      .forEach((nn) => {
        unvisited.push(nn);
        minCosts.set(hash(nn.pos), nn.score);
      });
  } while (unvisited.length > 0);
  return lowestCost;
}
