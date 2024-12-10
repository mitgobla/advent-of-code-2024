import { readFileSync } from "fs";

function parse_file(filePath: string) : Map<number, number[]> {
    const data = readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');
    const out = new Map<number, number[]>();
    for (const line of lines) {
        const [totalString, valueString] = line.split(': ');
        const numArray: number[] = valueString.split(' ').map(Number);
        const total = parseInt(totalString);
        out.set(total, numArray);
    }
    return out;
}

const data = parse_file('./day7/input.txt');

function check_combination(key: number, values: number[]): boolean {
    // Go through each binary combination of the number of gaps in the values array
    // i.e. [12, 34, 56] has 2 gaps, therefore binary has 00, 01, 10, 11 (4 combinations)
    // Binary bit is used to determine arithmetic operation
    const gaps = values.length - 1;
    for (let combination = 0; combination < (2 ** gaps); combination++) {
        // Initialize current total to the first number
        let currentTotal = values[0];
        for (let index = 0; index < gaps; index++) {
            // Use bit right shift to get first bit, to determine to multiply or add
            if (((combination >> index) & 1) === 0) {
                currentTotal += values[index + 1];
            } else {
                currentTotal *= values[index + 1];
            }
        }
        // If the total, after this combination, matches the key value, then it is a
        // valid combination of operations
        if (currentTotal === key) {
            return true;
        }
    }
    return false;
}

let runningTotal = 0;

for (const [key, values] of data) {
    // Go through each binary combination for * and + symbols for the array of values
    if (check_combination(key, values)) {
        runningTotal += key;
    }
}

console.log(runningTotal);