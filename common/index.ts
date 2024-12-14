import { readFileSync, writeFileSync } from "fs";
import { EOL } from "os";

export function readFile(filename: string): string[] {
  try {
    var data = readFileSync(filename, "utf8");
    return data.split(EOL);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function writeFile(filename: string, contents: string[]) {
  try {
    writeFileSync(filename, contents.join(EOL));
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function getTimeLogger(): (logMessage?: string) => void {
  const start = Date.now();
  return (logMessage?: string) => {
    const end = Date.now();
    const time = end - start;
    if (logMessage) {
      console.log(`${time}ms | ${logMessage} `);
    } else {
      console.log(`Time taken: ${time}ms`);
    }
  };
}
export const sum = (a: number, c: number): number => a + c;
export const product = (a: number, c: number): number => a * c;
export const max = (a: number, c: number): number => (a < c ? c : a);
export const printlines = (lines: string[][]) =>
  lines.forEach((line) => console.log(line.join("")));

export function assertDefined<T>(char: T | undefined): T {
  if (char == undefined) throw new Error();
  return char;
}
