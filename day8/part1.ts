import { readFileSync } from "fs";

function parse_file(filePath: string): string[] {
    const data = readFileSync(filePath, 'utf-8');
    return data.split('\n');
}

const radioMap = parse_file('./day8/input.txt');
const radioTowers = new Map<string, Array<[number, number]>>();

// Go through grid, and add coordinates of every tower found
// radioTowers = {'a': [[1, 2], [3, 4], ...], 'b': [[5, 6], [7, 8], ...], 'c': ...}
for (let row = 0; row < radioMap.length; row++) {
    for (let col = 0; col < radioMap[0].length; col++) {
        const element = radioMap[row][col];
        if (element !== '.') {
            if (!radioTowers.has(element)) {
                radioTowers.set(element, [[row, col]]);
            } else {
                const arr = radioTowers.get(element)!;
                arr.push([row, col]);
            }
        }
    }
}

function in_bounds(row: number, col: number): boolean {
    return (0 <= row && row < radioMap.length && 0 <= col && col < radioMap[0].length);
}

// function replace_at(str: string, chr: string, pos: number): string {
//     return str.substring(0, pos) + chr + str.substring(pos + 1);
// }

const processed = new Set<string>();
const antiNodes = new Set<string>();

for (const [, points] of radioTowers) {
    const towerCount = points.length;
    // Go through each combination of pair of towers
    for (let firstTower = 0; firstTower < towerCount; firstTower++) {
        for (let secondTower = firstTower + 1; secondTower < towerCount; secondTower++) {
            const pointA = points[firstTower];
            const pointB = points[secondTower];

            // Unique identifier of the current pair being processed
            const pairKey = `${Math.min(pointA[0], pointB[0])},${Math.min(pointA[1], pointB[1])}-${Math.max(pointA[0], pointB[0])},${Math.max(pointA[1], pointB[1])}`;

            if (processed.has(pairKey)) continue;
            processed.add(pairKey);

            // Get difference between points
            const rowDifference = pointB[0] - pointA[0];
            const colDifference = pointB[1] - pointA[1];

            // Get forward and backward point
            const antiPointA = [pointB[0] + rowDifference, pointB[1] + colDifference];
            const antiPointB = [pointA[0] - rowDifference, pointA[1] - colDifference];

            // Make key out of antinodes
            const antiPointAKey = `${antiPointA[0]},${antiPointA[1]}`;
            const antiPointBKey = `${antiPointB[0]},${antiPointB[1]}`;

            if (in_bounds(antiPointA[0], antiPointA[1]) && !antiNodes.has(antiPointAKey)) {
                antiNodes.add(antiPointAKey);
            }

            if (in_bounds(antiPointB[0], antiPointB[1]) && !antiNodes.has(antiPointBKey)) {
                antiNodes.add(antiPointBKey);
            }

        }

    }
}

console.log(antiNodes.size);