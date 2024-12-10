import { readFileSync } from "fs";

export function parse_file(filePath: string): string[] {
    const data = readFileSync(filePath, 'utf-8');
    return data.split('\n')
}

const puzzleMap = parse_file('./day6/input.txt');

// Find guard starting position
export function find_start_pos(grid: string[]): [number, number, string] {
    const valid_directions = new Set<string>(['^', '>', '<', 'v']);
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const element = grid[row][col];
            if (valid_directions.has(element)) {
                return [row, col, element];
            }
        }
    }
    return [-1, -1, ''];
}

type Direction = {
    nextRow: number;
    nextCol: number;
    nextDir: string;
}

// Instruction mapping of current direction to row/col change and next direction
export const directions = new Map<string, Direction>([
    ['^', {nextRow: -1, nextCol: 0, nextDir: '>'}],
    ['>', {nextRow: 0, nextCol: 1, nextDir: 'v'}],
    ['v', {nextRow: 1, nextCol: 0, nextDir: '<'}],
    ['<', {nextRow: 0, nextCol: -1, nextDir: '^'}]
])

let [currentRow, currentCol, currentDir] = find_start_pos(puzzleMap);
// 1 includes the starting position
let steps = 1;
// Keep track of visited coordinates so steps are only uniquely visited positions
const visited = new Set<string>();

// Function to check if coordinates are in bounds of the grid
export function in_bounds(grid: string[], row: number, col: number) : boolean {
    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length
}

// While we are in the bounds, keep processing steps
while (in_bounds(puzzleMap, currentRow, currentCol)) {
    const instruction = directions.get(currentDir)!;
    const [nextRow, nextCol] = [currentRow + instruction.nextRow, currentCol + instruction.nextCol];
    if (in_bounds(puzzleMap, nextRow, nextCol)) {
        // Check for obstacle
        if (puzzleMap[nextRow][nextCol] === '#') {
            // Change the direction we are facing
            currentDir = instruction.nextDir;
        } else {
            // We can move a step forward
            // Only increment steps if current position is not visited before
            if (!visited.has(`${currentRow},${currentCol}`)) {
                // New tile is not visited before, increment step
                steps++;
                visited.add(`${currentRow},${currentCol}`);
            }
            currentRow = nextRow;
            currentCol = nextCol;
        }
    } else {
        // Next position is out of map, so the guard will leave
        break;
    }
}

console.log(steps);