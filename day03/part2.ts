import { readFileSync } from 'fs';

export function parseFile(filePath: string) : string {
    return readFileSync(filePath, 'utf-8');
}

const input = parseFile('./day3/input.txt');

let index: number = 0;
let a: string = '', b: string = ''
let total: number = 0;
let enabled: boolean = true;

while (index <= input.length) {
    // Check for don't() and disable checking for mul(x, y)
    if (input.slice(index, index+7) === "don't()") {
        enabled = false;
        index += 7;
    }

    // Check for do() and enable checking for mul(x, y)
    if (input.slice(index, index+4) === 'do()') {
        enabled = true;
        index += 4;
    }

    // Check if we start with mul(
    if (input.slice(index, index+4) === 'mul(' && enabled) {
        index += 4;
        a = '';
        b = '';
        // Now extract the first number
        while (input[index] >= '0' && input[index] <= '9') {
            a += input[index];
            index ++;
        }
        // After exhausting the first number, check if we have a comma
        if (input[index] === ',') {
            index ++;
            // Now extract the second number
            while (input[index] >= '0' && input[index] <= '9') {
                b += input[index];
                index ++;
            }
        }
        // Finally, check if we end with a closed bracket
        if (input[index] === ')') {
            // Confirm that we have extracted two numbers
            if (a !== '' && b !== '') {
                // Convert to decimal
                const x: number = parseInt(a, 10);
                const y: number = parseInt(b, 10);

                // Multiply together, then add to total
                if (!isNaN(x) && !isNaN(y)) {
                    total += x * y
                }
            }
        }
    }
    index ++;
}

console.log(total);
