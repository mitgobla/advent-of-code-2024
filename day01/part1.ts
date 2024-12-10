import { readFileSync } from 'fs';


export function parseFile(filePath: string): [number[], number[]] {
    // Read file
    const data = readFileSync(filePath, 'utf-8');

    // Split data by lines, and remove empty lines
    const lines = data.split('\n').filter(line => line.trim() !== '');

    const array1: number[] = [];
    const array2: number[] = [];

    // Go through each line
    for (const line of lines) {
        // Split into two values by the 3 spaces between values
        const [value1, value2] = line.split("   ");
        // If values are not undefined
        if (value1 !== undefined && value2 !== undefined) {
            // Remove any whitespace and convert to decimal integers
            const num1 = parseInt(value1.trim(), 10);
            const num2 = parseInt(value2.trim(), 10);

            // If integers are parsed, then push to array
            if (!isNaN(num1) && !isNaN(num2)) {
                array1.push(num1);
                array2.push(num2);
            }
        }
    }

    // Sort minimum to maximum
    array1.sort((a, b) => a - b);
    array2.sort((a, b) => a - b);

    return [array1, array2]
}

const [array1, array2] = parseFile('./day1/input.txt');

let total: number = 0;

// Add up the total of the differences between each number
for (let index = 0; index < array1.length; index++) {
    total += Math.abs(array1[index] - array2[index]);
}

console.log(total);

