import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const connections: Map<string, Set<string>> = new Map()
data.forEach(line => {
  const [a, b] = line.split("-")
  if (!connections.has(a)) {
    connections.set(a, new Set([a]))
  }
  connections.get(a)!.add(b)

  if (!connections.has(b)) {
    connections.set(b, new Set([b]))
  }
  connections.get(b)!.add(a)
})

const AllSets: Set<string> = new Set()
const TSets: Set<string> = new Set()
data.forEach(line => {
  const [a, b] = line.split("-")

  const ac = connections.get(a)!;
  const bc = connections.get(b)!
  ac.forEach(v => {
    if (v == a) {
      return
    }
    if (v == b) {
      return
    }
    if (bc.has(v)) {
      const groupString = [a, b, v].sort().join();
      AllSets.add(groupString)
      if ([a, b, v].some(m => m.startsWith("t"))) {
        TSets.add(groupString)
      }
    }
  })
})

console.log({ part1: TSets.size });

logTime("Part 1");

function iterate(localSets: Set<string>): Set<string> {
  const NewSets = new Set<string>()
  localSets.forEach((set) => {
    NewSets.add(
      Array.from(
        ((set.split(","))
          .map(m => connections.get(m)!))
          .reduce((a, c) => a.intersection(c)))
          .sort()
          .join(","))
  })
  return NewSets
}

AllSets.clear()
data.forEach(line => {
  AllSets.add(line.split("-").sort().join(","))
})

var NewSets: Set<string> = AllSets
var sizeBefore: number = AllSets.size
do {
  sizeBefore = NewSets.size
  NewSets = iterate(NewSets)
}
while (sizeBefore != NewSets.size)

const longest = Array.from(NewSets).reduce((a, c) => {
  return a.length > c.length ? a : c
})
console.log({ part2: longest });

logTime("Part 2");

// ai,fr,hl,jh,jj,mr,oj,pz,qp,rn,rv,vb,vh is not right

export { };
