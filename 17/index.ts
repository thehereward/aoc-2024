import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const registerA = parseInt(data[0].split(":")[1]);
const registerB = parseInt(data[1].split(":")[1]);
const registerC = parseInt(data[2].split(":")[1]);
const program = data[4]
  .split(":")[1]
  .split(",")
  .map((c) => parseInt(c));

export interface State {
  A: number;
  B: number;
  C: number;
  out: number[];
  counter: number;
}

var state: State = {
  A: registerA,
  B: registerB,
  C: registerC,
  out: [],
  counter: 0,
};

export function getComboOperator(state: State, operand: number): number {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return state.A;
    case 5:
      return state.B;
    case 6:
      return state.C;
    case 7:
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
  program: number[],
  desired?: string
): State {
  const [opCode, operand] = program.slice(state.counter, state.counter + 2);
  // console.log(opCode, operand);

  switch (opCode) {
    case 0:
      // adv
      return {
        ...state,
        A: Math.floor(state.A / Math.pow(2, getComboOperator(state, operand))),
        counter: state.counter + 2,
      };
    case 1:
      // bxl
      return {
        ...state,
        B: state.B ^ operand,
        counter: state.counter + 2,
      };
    case 2:
      // bst
      return {
        ...state,
        B: getComboOperator(state, operand) % 8,
        counter: state.counter + 2,
      };
    case 3:
      // jnz
      if (state.A == 0)
        return {
          ...state,
          counter: state.counter + 2,
        };
      return {
        ...state,
        counter: operand,
      };
    case 4:
      // bxc
      return {
        ...state,
        B: state.B ^ state.C,
        counter: state.counter + 2,
      };
    case 5:
      // out
      const out = state.out.concat([getComboOperator(state, operand) % 8]);
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
    case 6:
      // bdv
      return {
        ...state,
        B: Math.floor(state.A / Math.pow(2, getComboOperator(state, operand))),
        counter: state.counter + 2,
      };
    case 7:
      // cdv
      return {
        ...state,
        C: Math.floor(state.A / Math.pow(2, getComboOperator(state, operand))),
        counter: state.counter + 2,
      };
    default:
      throw "Panic";
  }
  return state;
}

export function runProgram(
  _state: State,
  program: number[],
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

const targetOutput = "2,4,1,5,7,5,0,3,4,0,1,6,5,5,3,0";

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

var i = 109019476332289;
i--;
while (true) {
  i++;
  const testState = { ...state, A: i };
  try {
    const result = runProgram(testState, program);
    if (result.out.join(",") == targetOutput) {
      break;
    }
  } catch {}
}

const part2 = i;
console.log({ part2 });

logTime("Part 2");

export {};

// 109019476332289 is too high
// 109019476332288 is too high
// 109019476332297 is too high

// 109019476332289
// 109019473641472
