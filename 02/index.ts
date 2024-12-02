import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const reports = data.map((line) => {
  return line.split(" ").map((char) => parseInt(char));
});

const toDiff = (report: number[]): number[] => {
  return report
    .map((v, i) => {
      if (i + 1 < report.length) {
        return report[i + 1] - v;
      }
    })
    .filter((a) => a != undefined);
};

function isSafe(report: number[]): boolean {
  const diff = toDiff(report);
  if (diff.every((c) => c > 0) || diff.every((c) => c < 0)) {
    if (diff.every((x) => Math.abs(x) <= 3)) {
      return true;
    }
  }
  return false;
}

const unsafeButFixableReports: number[][] = [];

var safe = 0;
reports.forEach((report, i) => {
  if (isSafe(report)) {
    safe = safe + 1;
    return;
  }
  unsafeButFixableReports.push(report);
});
console.log({ safe });

logTime("Part 1");

var madeSafe = 0;

unsafeButFixableReports.forEach((unsafeReport) => {
  for (var i = 0; i < unsafeReport.length; i++) {
    var pseudoReport = unsafeReport.toSpliced(i, 1);
    if (isSafe(pseudoReport)) {
      madeSafe = madeSafe + 1;
      break;
    }
  }
});

console.log({ safe: safe + madeSafe });
logTime("Part 2");

export {};

// 554 was wrong
// 538 was wrong
// 514 was right
