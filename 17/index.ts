import { readFile, getTimeLogger, min } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const registerA: bigint = BigInt(data[0].split(":")[1]);
const registerB: bigint = BigInt(data[1].split(":")[1]);
const registerC:bigint = BigInt(data[2].split(":")[1]);
const program: bigint[] = data[4]
  .split(":")[1]
  .split(",")
  .map((c) => BigInt(c));

export interface State {
  A: bigint;
  B: bigint;
  C: bigint;
  out: bigint[];
  counter: number;
}

var state: State = {
  A: registerA,
  B: registerB,
  C: registerC,
  out: [],
  counter: 0,
};

export function getComboOperator(state: State, operand: bigint): bigint {
  switch (operand) {
    case 0n:
    case 1n:
    case 2n:
    case 3n:
      return BigInt(operand);
    case 4n:
      if (state.A < 0){
        throw "panic A"
      }
      return state.A;
    case 5n:
      if (state.B < 0){
        throw `panic B | ${state.B} | ${state.B.toString(2)}`
      }
      return state.B;
    case 6n:
      if (state.C < 0){
        throw "panic C"
      }
      return state.C;
    case 7n:
    default:
      throw "Panic";
  }
}

//   ???
//
//
//   100
// ^ 110
//   010

// B = A % 8
// B = B ^ 5
// C = A / (2 ^ B)
// A = Math.floor(A / 8)
// B = B ^ C
// B = B ^ 6
// OUT = B % 8
// if A == 0

export function nextState(
  state: State,
  program: bigint[],
  desired?: string
): State {
  const [opCode, operand] = program.slice(state.counter, state.counter + 2);
  // console.log(opCode, operand);

  switch (opCode) {
    case 0n:
      // adv
      return {
        ...state,
        A: state.A / (2n ** getComboOperator(state, operand)),
        counter: state.counter + 2,
      };
    case 1n:
      // bxl
      return {
        ...state,
        B: state.B ^ operand,
        counter: state.counter + 2,
      };
    case 2n:
      // bst
      return {
        ...state,
        B: getComboOperator(state, operand) % 8n,
        counter: state.counter + 2,
      };
    case 3n:
      // jnz
      if (state.A == 0n)
        return {
          ...state,
          counter: state.counter + 2,
        };
      return {
        ...state,
        counter: Number(operand),
      };
    case 4n:
      // bxc
      return {
        ...state,
        B: state.B ^ state.C,
        counter: state.counter + 2,
      };
    case 5n:
      // out
      const combo = getComboOperator(state, operand);
      const newOut = combo % 8n;
      if (newOut < 0){
        console.log(`${operand} ${combo} ${newOut} PANIC`);
        throw 'panic'
      }
      const out = state.out.concat([newOut]);
      if (desired) {
        if (!desired.startsWith(out.join(","))) {
          throw "Abort";
        }
      }
      return {
        ...state,
        out: out,
        counter: state.counter + 2,
      };
    case 6n:
      // bdv
      return {
        ...state,
        B: state.A / (2n ** getComboOperator(state, operand)),
        counter: state.counter + 2,
      };
    case 7n:
      // cdv
      return {
        ...state,
        C: state.A / (2n ** getComboOperator(state, operand)),
        counter: state.counter + 2,
      };
    default:
      throw "Panic";
  }
  return state;
}

export function runProgram(
  _state: State,
  program: bigint[],
  desired?: string
): State {
  var state = structuredClone(_state);
  while (state.counter < program.length) {
    state = nextState(state, program, desired);
  }

  return state;
}

const part1State = runProgram(state, program);

const part1 = part1State.out.join(",");
console.log({ part1 });

logTime("Part 1");

// 3                                                            11
// 24                                                        11000
// 192                                                    11000000
// 1538                                                11000000010
// 12691                                            11000110010011
// 101532                                        11000110010011100
// 812258                                     11000110010011100010
// 6498067                                 11000110010011100010011
// 51984537                             11000110010011100010011001
// 415876298                         11000110010011100010011001010
// 3327010386                     11000110010011100010011001010010
// 26616083088                 11000110010011100010011001010010000
// 212928664710             11000110010011100010011001010010000110
// 1703429317682         11000110010011100010011001010010000110010
// 13627434541536     11000110010011100010011001010010000111100000
// 109019476332289 11000110010011100010011001010010000111100000001

// 0b11000110010011100010011001010010000111100000001 is upper bound 109019476332289
// 0b00111111111111111010101001111010011000000100001 is lower bound  35183654678561

// const lower = 1
// const upper = 8
// const lower = 0b011000110010011100000
const lower = 1
const upper = 8
const target = "2,4,1,5,7,5,0,3,4,0,1,6,5,5,3,0".split(",").toReversed();
// const target = "0,3,5,4,3,0".split(",").toReversed();
// const target = "5,5,3,0".split(",").toReversed();
var targetOutput: string[] = []
var inputs: bigint[] = []
var newInputs: bigint[] = [1n]
do {
  const t = target.shift()
  if (!t) throw "panic"
  inputs = newInputs
  targetOutput.unshift(t)
  const outputString = targetOutput.join(",")
  // console.log(outputString);
  // console.log(inputs);

  newInputs = []
  inputs.forEach(input => {
    for (var i = input; i < input + 8n; i++) {
      const testState = { ...state, A: i };
      // try {
        const result = runProgram(testState, program);
        if (result.out.join(",") == outputString) {
          // console.log(`${i.toString(2).padStart(3, "0")} | ${i} -> ${result.out.join(",")}`);
          newInputs.push(i * 8n)
        }

      // } catch { }
    }
  })
} while (target.length > 0)
// var i = 109019476332289;
// i--;

const answers = newInputs.map(i => i/8n)
// console.log(newInputs.map(i => i/8).sort((a, b) => a - b));

// const answers: number[] = []
// inputs.forEach(input => {
//   const testState = { ...state, A: input }
//   const result = runProgram(testState, program)
//   if (result.out.join(",") == "2,4,1,5,7,5,0,3,4,0,1,6,5,5,3,0") {
//     answers.push(input)
//   } else {
//     console.log(`not an answer ${input}`);

//   }
// })

answers.sort((a,b) => Number(a-b))
// console.log({ answers });

export const bigMin = (a: bigint, c: bigint): bigint => (a > c ? c : a);


console.log({part2: Number(answers.reduce(bigMin))});

// const part2 = i.toString(2);
// console.log({ part2, i });

logTime("Part 2");

export { };

// 109019476330651
// 109019476332289
// 109019476332289 is too high
// 109019476332288 is too high
// 109019476332297 is too high
// 109019476331273 not the right answer

// [
//   109019476332288, 109019476332296, 109019484753664, 109019484753672, 109019485736704,
//   109019485736712, 109019485802240, 109019485802248, 109019488849664, 109019488849672,
//   136902133483928, 136902135581080, 136902144002456, 136902144985496, 136902145051032,
//   136902148098456
// ]

// 109019476332289
// 109019473641472
// 109019476330651