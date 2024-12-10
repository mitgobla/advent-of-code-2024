import { readFileSync } from "fs";

export function parse_file(fileName: string): number[] {
    const data = readFileSync(fileName, 'utf-8');
    return data.split('').map(Number);
}

// Custom stack implementation that takes [x: number, y: number] items
// y defines the number of times x will be popped, before the entire item is removed
// More efficient than storing x in an array y times
export class TupleStack {
    private stack: Array<[number, number]> = [];

    push(item: [number, number]): void {
        this.stack.push(item);
    }

    pop(): number | undefined {
        while (this.stack.length > 0) {
            const stackTop = this.stack[this.stack.length - 1];
            const [x, y] = stackTop;

            if (y > 0) {
                // Decrement y
                this.stack[this.stack.length - 1] = [x, y - 1];
                // Return x
                return x;
            } else {
                // Y is exhausted, remove tuple from stack
                this.stack.pop();
            }
        }
        // No items left in stack
        return undefined;
    }

    // See what is on top of the stack without decrementing it
    peek(): [number, number] | undefined {
        if (this.stack.length > 0) {
            return this.stack[this.stack.length - 1];
        }
        return undefined;
    }

    get length(): number {
        return this.stack.length;
    }
}

const diskMap = parse_file('./day9/input.txt');
const indexedDisk: number[] = []
const blockStack = new TupleStack();

// 1. Initialize disk
for (let index = 0; index < diskMap.length; index++) {
    const blockSize = diskMap[index];
    if (index % 2 === 0) {
        // File Block
        blockStack.push([index / 2, blockSize]);
        for (let block = 0; block < blockSize; block++) {
            indexedDisk.push(index / 2);
        }
    } else {
        // Free Space Block
        for (let block = 0; block < blockSize; block++) {
            indexedDisk.push(NaN);
        }
    }
}

const trimmedDisk: number[] = []

// 2. Process free space
for (let index = 0; index < indexedDisk.length; index++) {
    const element = indexedDisk[index];
    if (isNaN(element)) {
        // Free space
        if (blockStack.length > 0) {
            // Get last block index of disk and put into free space
            trimmedDisk.push(blockStack.pop()!)
        }
    } else {
        // Exisiting file block
        // Check if existing file block is === blockStack top
        // If so, we know there are no more blocks to add to free space after
        if (blockStack.length > 0) {
            const [block,count] = blockStack.peek()!;
            if (element === block) {
                // Exhaust whatever is left in the block stack of this element, then end.
                for (let j = 0; j < count; j++) trimmedDisk.push(element);
                break;
            }
        }
        trimmedDisk.push(element);
    }
}

// 3. Calculate sum of product
let total = 0;
for (let index = 0; index < trimmedDisk.length; index++) {
    total += trimmedDisk[index] * index;
}

console.log(total);