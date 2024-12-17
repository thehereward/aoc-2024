import { expect, test } from "bun:test";
import { getComboOperator, type State, runProgram } from ".";

const testState: State = {
  A: 0,
  B: 0,
  C: 0,
  out: [],
  counter: 0,
};

test("", () => {
  const combo = getComboOperator(testState, 0);
  expect(combo).toBe(0);
});

test("", () => {
  const combo = getComboOperator(testState, 1);
  expect(combo).toBe(1);
});

test("", () => {
  const combo = getComboOperator(testState, 2);
  expect(combo).toBe(2);
});

test("", () => {
  const combo = getComboOperator(testState, 3);
  expect(combo).toBe(3);
});

test("", () => {
  const state = structuredClone(testState);
  state.A = 3;
  const combo = getComboOperator(state, 4);
  expect(combo).toBe(3);
});

test("", () => {
  const state = structuredClone(testState);
  state.B = 3;
  const combo = getComboOperator(state, 5);
  expect(combo).toBe(3);
});

test("", () => {
  const state = structuredClone(testState);
  state.C = 3;
  const combo = getComboOperator(state, 6);
  expect(combo).toBe(3);
});

test("If register C contains 9, the program 2,6 would set register B to 1.", () => {
  const state = structuredClone(testState);
  state.C = 9;
  const next = runProgram(state, [2, 6]);
  expect(next.B).toBe(1);
});

test("If register A contains 10, the program 5,0,5,1,5,4 would output 0,1,2.", () => {
  const state = structuredClone(testState);
  state.A = 10;
  const next = runProgram(state, [5, 0, 5, 1, 5, 4]);
  expect(next.out).toEqual([0, 1, 2]);
});

test("If register A contains 2024, the program 0,1,5,4,3,0 would output 4,2,5,6,7,7,7,7,3,1,0 and leave 0 in register A.", () => {
  const state = structuredClone(testState);
  state.A = 2024;
  const next = runProgram(state, [0, 1, 5, 4, 3, 0]);
  expect(next.out).toEqual([4, 2, 5, 6, 7, 7, 7, 7, 3, 1, 0]);
  expect(next.A).toBe(0);
});

test("If register B contains 29, the program 1,7 would set register B to 26.", () => {
  const state = structuredClone(testState);
  state.B = 29;
  const next = runProgram(state, [1, 7]);
  expect(next.B).toBe(26);
});

test("If register B contains 2024 and register C contains 43690, the program 4,0 would set register B to 44354.", () => {
  const state = structuredClone(testState);
  state.B = 2024;
  state.C = 43690;
  const next = runProgram(state, [4, 0]);
  expect(next.B).toBe(44354);
});

test("Test", () => {
  const state = structuredClone(testState);
  state.A = 109019476332289;
  const next = runProgram(
    state,
    [2, 4, 1, 5, 7, 5, 0, 3, 4, 0, 1, 6, 5, 5, 3, 0]
  );
  expect(next.out).toEqual([2, 4, 1, 5, 7, 5, 0, 3, 4, 0, 1, 6, 5, 5, 3, 0]);
});


test("Test", () => {
  const state = structuredClone(testState);
  state.A = 109019476332289;
  const next = runProgram(
    state,
    [2, 4, 1, 5, 7, 5, 0, 3, 4, 0, 1, 6, 5, 5, 3, 0]
  );
  expect(next.out).toEqual([2, 4, 1, 5, 7, 5, 0, 3, 4, 0, 1, 6, 5, 5, 3, 0]);
});

test("", () => {
  expect(Number.MAX_SAFE_INTEGER).toBe(9007199254740991)
})
