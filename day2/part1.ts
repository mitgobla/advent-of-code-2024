import { readFileSync } from 'fs';

export function parseFile(filePath: string): number[][] {
    const data = readFileSync(filePath, 'utf-8');

    const lines = data.split('\n').filter(line => line.trim() !== '');

    const arrayOut: number[][] = [];

    for (const line of lines) {
        const values: number[] = line.split(' ').map(Number);
        arrayOut.push(values);
    }

    return arrayOut;
}

const values = parseFile('./day2/input.txt');

// 1. Check first value to second to determine if increasing or decreasing
// 2. If increasing, next value must be greater than the current by 1, and at most 3
// 2. If decreasing, next value must be less than the current by 1, and at most 3

export function isRowSafe(row: number[], increasing: boolean): boolean {
    //console.log(row, increasing);
    for (let index = 0; index < (row.length - 1); index++) {
        const diff = row[index] - row[index + 1];
        const absDiff = Math.abs(diff);
        //console.log(`index ${index}     diff ${diff}   absDiff ${absDiff}`);

        // Difference should be between 1 and 3
        if (absDiff < 1 || absDiff > 3) {
            return false;
        }

        // Current should be less than next, if increasing
        if (increasing && diff <= 0) {
            return false;
        // Current should be greater than next, if decreasing
        } else if (!increasing && diff >= 0) {
            return false;
        }
    }
    return true;
}

let total: number = 0;

// Total how many return safe
for (const row of values) {
    const increasing: boolean = row[0] > row[1];
    total += isRowSafe(row, increasing) ? 1 : 0;
}

console.log(total);