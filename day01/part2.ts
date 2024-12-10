import { parseFile } from "./part1";

const [array1, array2] = parseFile('./day1/input.txt');


// hashmap definition with types
const numberMap = new Map<number, number>();

// Get the total count of each value that exists in the second array
for (const value of array2) {
    if (numberMap.has(value)) {
        const current = numberMap.get(value);
        if (current !== undefined) {
            // Since the number exists,
            // Increment its count by 1
            numberMap.set(value, current + 1);
        }
    } else {
        // First time we've come across this number
        // Set it to 1 as first occurance
        numberMap.set(value, 1);
    }
}

let total: number = 0;

// Now go through each value in the first array
for (const value of array1) {
    if (numberMap.has(value)) {
        const current = numberMap.get(value);
        // If the value exists in the mapping
        // We multiply the count of that value from the mapping with the
        // current value, and add it to the total
        if (current !== undefined) {
            total += value * current;
        }
    }
}

console.log(total);