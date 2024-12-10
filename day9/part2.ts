import { parse_file } from "./part1";

const diskMap = parse_file('./day9/input.txt'); // Assume this provides the input array

const disk: Array<[number, number]> = [];

for (let index = 0; index < diskMap.length; index += 2) {
    // Push fileblock
    disk.push([index / 2, diskMap[index]]);
    // Push gap
    if (index + 1 < diskMap.length) {
        disk.push([NaN, diskMap[index + 1]]);
    }
}

// Set of IDs that have been visited
// Each ID is only tried to get moved once
const visited = new Set<number>();

// Offset depending on if disk is odd or even length
const offset = disk.length % 2 === 0 ? 2 : 1;

// Go through disk backwards
for (let index = disk.length - offset; index >= 0; index--) {
    const [blockID, blockSize] = disk[index];
    // Skip gaps or if we've already visited this ID
    if (isNaN(blockID) || visited.has(blockID)) {
        continue;
    }

    // Add block ID to visited
    visited.add(blockID);
    // Find gap that fits block ID
    for (let gapIndex = 0; gapIndex < index; gapIndex++) {
        const [gapID, gapSize] = disk[gapIndex];
        // Check if gap and is large enough to fit
        if (isNaN(gapID) && gapSize >= blockSize) {
            // Decrement gap size
            disk[gapIndex][1] = gapSize - blockSize;
            // Splice block into position
            disk.splice(gapIndex, 0, [blockID, blockSize]);
            // Replace original block position with gap
            index++;
            disk[index] = [NaN, blockSize];
            break; // exit the inner loop once block is placed
        }
    }
}

let checksum: number = 0;
let position: number = 0;

// Checksum
for (let index = 0; index < disk.length; index++) {
    const [blockID, blockSize] = disk[index];
    if (!isNaN(blockID)) {
        for (let count = position; count < (position + blockSize); count++) {
            checksum += blockID * count;
        }
    }
    // Increment position by the size of the block/gap
    position += blockSize;
}

console.log(checksum);
