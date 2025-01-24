import { readFile, getTimeLogger, sum as intSum } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const initial = new Map<string, boolean>()
const resolved = new Map<string, boolean>()
const gates: Gate[] = []

type GateType = "AND" | "OR" | "XOR";

interface Gate {
  input1: string,
  input2: string,
  output: string,
  type: GateType,
}

const regex = /^(.+) (AND|OR|XOR) (.+) -> (.+)$/

var readingInitialConditions = true
data.forEach(line => {
  if (line.length == 0) {
    readingInitialConditions = false
    return
  }

  if (readingInitialConditions) {
    const [k, v] = line.split(": ")
    initial.set(k, v == "1")
    resolved.set(k, v == "1")
  } else {
    const m = line.match(regex)!
    gates.push({
      input1: m[1],
      input2: m[3],
      output: m[4],
      type: m[2] as GateType,
    })
  }
})

function getOutput() {
  var toProcess: Gate[]
  do {
    toProcess = gates.filter(g => !resolved.has(g.output) && resolved.has(g.input1) && resolved.has(g.input2))

    toProcess.forEach(gate => {
      const i1 = resolved.get(gate.input1)!
      const i2 = resolved.get(gate.input2)!
      switch (gate.type) {
        case "AND":
          resolved.set(gate.output, i1 && i2)
          break
        case "OR":
          resolved.set(gate.output, i1 || i2)
          break
        case "XOR":
          resolved.set(gate.output, i1 != i2)
          break
      }
    })
  } while (toProcess.length > 0)

  const output: { i: number, v: boolean }[] = []
  const oMap = new Map<number, boolean>()
  resolved.forEach((v, k) => {
    if (k.startsWith("z")) {
      const key = parseInt(k.slice(1));
      output.push({ i: key, v })
      oMap.set(key, v)
    }
  })
  return { output, oMap }
}

const { output } = getOutput()
const part1 = parseInt(toString(output), 2)

console.log({ part1 });

logTime("Part 1");

function toString(output: { i: number, v: boolean }[]): string {
  return output.sort((a, b) => b.i - a.i).map(o => o.v ? "1" : "0").join("");
}

function test(a: bigint, b: bigint = 0n) {
  const aS = a.toString(2).padStart(45, "0").split("").reverse()
  const bS = b.toString(2).padStart(45, "0").split("").reverse()
  // console.log({aS, bS});

  resolved.clear()
  aS.forEach((v, i) => {
    resolved.set(`x${i.toString().padStart(2, "0")}`, v == "1" ? true : false)
  })
  bS.forEach((v, i) => {
    resolved.set(`y${i.toString().padStart(2, "0")}`, v == "1" ? true : false)
  })
  // console.log(resolved);
  // console.log(gates);

  return getOutput()
}

// const N_BITS = 6
// for (var i = 1; i < 2 ** N_BITS; i = i << 1) {

//   const result = testNumbers(i, i);
//   const suffix = result == (i && i) ? " ✅" :  " ❌ "
//   console.log(`${i.toString(2).padStart(N_BITS, "0")} ==> ${result.toString(2).padStart(N_BITS, "0")}${suffix}`);
// }

function swap(a: string, b: string) {
  const gateA = gates.find(g => g.output == a)!
  const gateB = gates.find(g => g.output == b)!
  gateA.output = b
  gateB.output = a
}

const SWAPS = [
  ["z11", "wpd"],
  ["skh", "jqf"],
  ["z19", "mdd"],
  // ["wts", "z37"],
  ["rhh", "wts"]
]

SWAPS.forEach(([a,b]) => swap(a,b))

const N_BITS = 45
var count = 0
const MAX = 2 ** N_BITS
console.log({ MAX });

var errors = 0
console.log("XORs");

// for (var i = 1n; i < MAX; i = i << 1n) {
//   // console.log(i);
//   // if (count > N_BITS) process.exit()
//   // const b = 1n
//   const expected = i + 0n
//   const result = testNumbers(0n, i);
//   const suffix = result == (expected) ? " ✅" : ` ❌ ${expected.toString(2).padStart(N_BITS, "0")}`
//   if (result != expected) {
//     console.log(count, expected, result);
//     console.log(`${i.toString(2).padStart(N_BITS, "0")} ==> ${result.toString(2).padStart(N_BITS, "0")}${suffix}`);
//     errors++
//   }
//   count++
// }

console.log("ANDs");

count = 0
// for (var i = 1n; i < MAX; i = i << 1n) {
//   // console.log(i);
//   // if (count > N_BITS) process.exit()
//   // const b = 1n
//   const expected = i + i
//   const result = testNumbers(i, i);
//   const suffix = result == (expected) ? " ✅" : ` ❌ ${expected.toString(2).padStart(N_BITS, "0")}`
//   if (result != expected) {
//     console.log(count, expected, result);
//     console.log(`${i.toString(2).padStart(N_BITS, "0")} ==> ${result.toString(2).padStart(N_BITS, "0")}${suffix}`);
//     errors++
//   }
//   count++
// }

// console.log({ errors });

// console.log(13, testNumbers(5n,8n))
// console.log(40, testNumbers(20n,20n))
// console.log(100008, testNumbers(100000n,8n))
// console.log(0, testNumbers(0n, 0n))
// console.log(35184372088831, testNumbers(35184372088831n, 0n))
// console.log(35184372088831, testNumbers(35184372088830n, 1n))
// console.log(5184372088831, testNumbers(5184372088830n, 1n))
// console.log(444, testNumbers(123n, 321n))

console.log({
  part2: SWAPS.flatMap(s => s).sort().join()
});

var indexCount = 0
for (var index = 1n; index < MAX; index = index << 1n) {
  for (var addNum = 0n; addNum < 16n; addNum++) {
    const expect = index + addNum
    const actualy = testNumbers(index, addNum)
    if (expect != actualy) {
      console.log(indexCount, index, addNum, expect, actualy);
    }
  }
  indexCount++
}

// jqf,mdd,rhh,skh,wpd,wts,z11,z19 is WRONG

// x38 XOR y38 ==> z38 TRUE (and is z38)

// x36 AND y36 ==> z37 TRUE _but_ actually z38
// x37 AND y37 ==> z38 TRUE _but_ actually z37
// x37 XOR 0 ==> z37 TRUE _but_ actually z38

// SWAP
// z11 / wpd
// skh / jqf
// z19 / mdd

// z37 / smt NO


// sqj XOR wts -> z38

/*

y36 XOR x36 -> hbh

khf AND djt -> khs // always false
x35 AND y35 -> qtv // always false
qtv OR khs -> rfq // false
rfq XOR hbh -> z36
rfq AND hbh -> pwb

y36 AND x36 -> jdc
pwb OR jdc -> smt

y37 XOR x37 -> wpp
smt XOR wpp -> wts
wpp AND smt -> jgw

sqj XOR wts -> z38

jgw OR rhh -> z37

-----
jgw OR rhh -> z37
wpp AND smt -> jgw
y37 AND x37 -> rhh
y37 XOR x37 -> wpp
smt XOR wpp -> wts
smt XOR wpp -> wts

y36 XOR x36 -> hbh
y36 AND x36 -> jdc
rfq AND hbh -> pwb
rfq XOR hbh -> z36



--- FIRST SWAP

y11 XOR x11 -> gkc
y11 AND x11 -> dpf
gkc AND qqw -> z11
qqw XOR gkc -> wpd
fws OR gvj -> qqw
wpd OR dpf -> dtq
rmb AND kmr -> fws
x10 XOR y10 -> rmb
jmp OR csb -> kmr
kmr XOR rmb -> z10

z11 / wpd --  it just _is_ this

--- SECOND SWAP

x15 XOR y15 -> jqf
x15 AND y15 -> skh
jqf OR kjk -> kbq
skh XOR rkt -> z15
smd OR ttv -> rkt
rkt AND skh -> kjk

jqf / skh

--- THIRD SWAP

y19 AND x19 -> z19
x19 XOR y19 -> cmp
cmp AND wfc -> pbb
wfc XOR cmp -> mdd
wfm OR mts -> wfc
cmp AND wfc -> pbb

pbb OR mdd -> hvn
bvw AND hvn -> cmm
bvw XOR hvn -> z20
y20 XOR x20 -> bvw
y20 AND x20 -> jgg

-- FOURTH SWAP

y36 AND x36 -> jdc
y37 XOR x37 -> wpp
y37 AND x37 -> rhh
wpp AND smt -> jgw
smt XOR wpp -> wts
pwb OR jdc -> smt
sqj XOR wts -> z38
rfq AND hbh -> pwb

jgw OR rhh -> z37

qtv OR khs -> rfq


// CORRECT
z37 = (pwb OR (y36 AND x36)) XOR (y37 XOR x37)   

// INCORRECT
z37 = ((pwb OR (y36 AND x36)) AND (y37 XOR x37 )) OR (y37 AND x37)
z37 = ((y37 XOR x37) AND (pwb OR (y36 AND x36))) OR ((pwb OR (y36 AND x36)) XOR (y37 XOR x37))

wts/z37 correct
rhh/wts incorrect

0000000011000000000000000000000000000000000000
0000000011000000000000000000000000000000000000
0000000110000000000000000000000000000000000000

*/

function evalCorrect(pwb: boolean, y36: boolean, x36: boolean, y37: boolean, x37: boolean): boolean{
 return (pwb || (y36 && x36)) != (y37 != x37)   
}

function evalIncorrect(pwb: boolean, y36: boolean, x36: boolean, y37: boolean, x37: boolean): boolean{
  return ((y37 != x37) && (pwb || (y36 && x36))) || ((pwb || (y36 && x36)) != (y37 != x37))
  // return ((pwb || (y36 && x36)) && (y37 != x37 )) || (y37 && x37)
 }

console.log("TRUTH TABLE");

for (var inp = 0; inp < 32; inp++){
  const [pwb, y36, x36, y37, x37] = inp.toString(2).padStart(5, "0").split("").map(m => m == "1" ?  true: false)
  const correct = evalCorrect(pwb, y36, x36, y37, x37)
  const incorrect = evalIncorrect(pwb, y36, x36, y37, x37)
  console.log(correct != incorrect ? "❌": "✅" ,correct, incorrect, pwb, y36, x36, y37, x37);
}

console.log("/TRUTH TABLE");

const newLocal1 = 1n << 36n;
const newLocal2 = 3n << 35n;

const nnnnnnn  = 1n <<3n;
for (var local1 = 0n; local1 < 32n; local1++){
  for (var local2 = 0n; local2 < 32n; local2++){
    const exp = nnnnnnn + local1 + nnnnnnn + local2
    const result = testNumbers(nnnnnnn + local1, nnnnnnn+ local2)
    if (exp != result){
      console.log(local1, local2);
    
    }
  }
}

const e = testNumbers(newLocal1, newLocal2)
console.log(newLocal1.toString(2).padStart(40, "0"));
console.log(newLocal2.toString(2).padStart(40, "0"));
console.log(e.toString(2).padStart(40, "0"));

// 0010000000000000000000000000000000000000
// 0011000000000000000000000000000000000000
// 0101000000000000000000000000000000000000

// 343597383680n
// 343597383680n

// console.log(MAX.toString(2));

// console.log(newLocal1.toString(2).padStart(46, "0"));
// console.log(newLocal2.toString(2).padStart(46, "0"));
// console.log(e.toString(2).padStart(46, "0"));

// const ttt = testNumbers(1n<<37n, 0n)
// console.log({ttt: ttt.toString(2)});

logTime("Part 2");

export { };

function testNumbers(a: bigint, b: bigint): bigint {
  const { oMap } = test(a, b);
  // console.log({i});
  // console.log(oMap);
  const m: boolean[] = [];
  for (var o = 0; o < N_BITS; o++) {
    if (oMap.has(o)) {
      // console.log({o, v: oMap.get(o)});
      m.push(oMap.get(o)!);
    }
    else {
      // console.log(o);
      m.push(false);
    }
  }
  const result = m.reverse().map(p => p ? "1" : "0").join("");
  // console.log(result);

  return BigInt(`0b${result}`)
}

