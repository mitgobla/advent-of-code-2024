import { readFileSync } from "fs";

function parse_file(filePath: string): Map<string, number> {
    const data = readFileSync(filePath, 'utf-8');
    const stones = data.split(' ');
    const out = new Map<string, number>();
    for (const stone of stones) {
        out.set(stone, (out.get(stone) || 0) + 1);
    }
    return out;
}

function transform_stone(stone: string): string[] {
    // 1st Rule
    if (stone === '0') {
        return ['1'];
    }

    // 2nd Rule
    if (stone.length % 2 === 0) {
        const middle = stone.length / 2;
        // Remove leading zeros using regex
        const firstHalf = stone.slice(0, middle).replace(/^0+/, '');
        const secondHalf = stone.slice(middle, stone.length).replace(/^0+/, '');
        // Empty strings are returned as '0' instead
        return [firstHalf || '0', secondHalf || '0'];
    }

    // 3rd Rule
    let stoneInt = parseInt(stone);
    stoneInt *= 2024;
    return [stoneInt.toString()];
}

let stones = parse_file('./day11/input.txt');
let counter = 0;

const steps = 25;

while (counter < steps) {
    const next_stones = new Map<string, number>();
    for (const [stone, count] of stones.entries()) {
        const transformed = transform_stone(stone);
        for (const newStone of transformed) {
            next_stones.set(newStone, (next_stones.get(newStone) || 0) + count);
        }
    }
    stones = next_stones;
    counter++;
}

let total = 0;

for (const count of stones.values()) {
    total += count;
}

console.log(total);