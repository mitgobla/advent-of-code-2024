import { parseFile, isRowSafe } from "./part1";

const values = parseFile('./day2/input.txt');

function dampener(row: number[]): boolean {
    // Check if the row entirely is safe first
    let increasing: boolean = row[0] > row[1];
    if (isRowSafe(row, increasing)) {
        return true;
    }

    // If not, try checking if safe with one item removed,
    // starting with the first item, until the last item.
    for (let index = 0; index < row.length; index++) {
        // Make a new array which has the current index item removed
        const slicedRow = [...row.slice(0, index), ...row.slice(index + 1)];
        // the increasing check could have changed since removing an item
        increasing = slicedRow[0] > slicedRow[1];

        if (isRowSafe(slicedRow, increasing)) {
            return true;
        }
    }

    // No possible combinations are safe
    return false;
}

let total: number = 0;

// Total how many return safe
for (const row of values) {
    total += dampener(row) ? 1 : 0;
}

console.log(total);