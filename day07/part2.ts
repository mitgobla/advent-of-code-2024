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

// Very similar to part 1, but use integer represented as a base-3 number for additional
// state for concatination
function check_combination(key: number, values: number[]): boolean {
    // Go through each combination of the number of gaps in the values array
    // i.e. [12, 34, 56] has 2 gaps, therefore has 000, 111, 222, 011, 022, ... 3**gaps combinations
    const gaps = values.length - 1;
    for (let combination = 0; combination < (3 ** gaps); combination++) {
        // Initialize current total to the first number
        let currentTotal = values[0];
        let currentCombination = combination;
        for (let index = 0; index < gaps; index++) {
            // Use modulo to get 0, 1, or 2 from the decimal of combination
            const operation = currentCombination % 3
            // Shift current combination to next digit
            currentCombination = Math.floor(currentCombination / 3);
            if (operation === 0) {
                // Addition
                currentTotal += values[index + 1];
            } else if (operation === 1) {
                // Multiplication
                currentTotal *= values[index + 1];
            } else if (operation === 2) {
                // Concatenation
                // Merge current with next value as string, then parse integer
                currentTotal = parseInt(`${currentTotal}${values[index + 1]}`);
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
