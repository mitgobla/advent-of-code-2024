import { readFileSync } from "fs";

export function parse_file(filePath: string): number[][] {
    const data = readFileSync(filePath, 'utf-8');
    return data.split('\n').map(row => row.split('').map(Number));
}

function in_bounds(grid: number[][], x: number, y: number): boolean {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
}

// Left, Up, Right, Down
const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]]
function find_paths(grid: number[][], x: number, y: number, visited: Set<string>): number {
    // Out of bound coordinate
    if (!in_bounds(grid, x, y)) {
        return 0;
    }

    // Position already visited
    if (visited.has(`${x},${y}`)) {
        return 0;
    }

    const current = grid[x][y];

    // End of path
    if (current === 9) {
        return 1;
    }

    let total_paths = 0;
    // Check each cardinal direction of the current position
    for (const [dx, dy] of directions) {

        const nx = x + dx;
        const ny = y + dy;

        // Check if in bounds and is +1 of current value
        if (in_bounds(grid, nx, ny) && grid[nx][ny] === current + 1) {
            // Visit next coordinate, using recursion
            total_paths += find_paths(grid, nx, ny, visited);
        }
    }

    visited.delete(`${x},${y}`);
    return total_paths;
}

function find_start_positions(grid: number[][]): Array<[number, number]> {
    // Find all positions that are equal to 0 (starting points)
    const out: Array<[number, number]> = [];
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const element = grid[row][col];
            if (element === 0) {
                out.push([row, col]);
            }
        }
    }
    return out;
}

const grid = parse_file('./day10/input.txt');
const starts = find_start_positions(grid);
let total = 0;

for (const [startX, startY] of starts) {
    const visited = new Set<string>();
    const add = find_paths(grid, startX, startY, visited);
    total += add;
}

console.log(total);