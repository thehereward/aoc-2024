import { readFile, getTimeLogger, sum as intSum } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const schematics: string[][] = []
var schematic: string[] = []
data.forEach(line => {
    if (line.length == 0) {
        schematics.push(schematic)
        schematic = []
    } else {
        schematic.push(line)
    }
})

const locks: string[][] = []
const keys: string[][] = []

schematics.forEach(schematic => {
    if (schematic[0] == '#####') {
        locks.push(schematic)
    } else {
        keys.push(schematic)
    }
})

const lockCounts = locks.map(lock => {
    const counts: number[] = []
    for (var i = 0; i < lock[0].length; i++) {
        var count = 0
        for (var j = 1; j < lock.length; j++) {
            if (lock[j][i] == '#') {
                count++
            }
        }
        counts.push(count)
    }
    return counts
})

const keyCounts = keys.map(key => {
    const counts: number[] = []
    for (var i = 0; i < key[0].length; i++) {
        var count = 0
        for (var j = key.length - 2; j > 0; j--) {
            if (key[j][i] == '#') {
                count++
            }
        }
        counts.push(count)
    }
    return counts
})

const combinations: number[][] = []
lockCounts.forEach(lock => {
    keyCounts.forEach(key => {
        combinations.push(key.map((v,i) => v + lock[i]))
    })
})


console.log({part1: combinations.filter(c => !c.some(n => n > 5)).length});


logTime("Part 1");

logTime("Part 2");

export { };
