import { readFileSync } from "fs";

function parse_file(filePath: string): string[][] {
    const data = readFileSync(filePath, 'utf-8');
    return data.split('\n').map(row => row.split(''));
}

function in_bounds(grid: string[][], row: number, col: number): boolean {
    return 0 <= row && row < grid.length && 0 <= col && col < grid[0].length;
}

// Up, Down, Left, Right
const directions: Array<[number, number]> = [[-1, 0], [1, 0], [0, -1], [0, 1]];

type Shape = {
    area: number,
    perimeter: number
}

function fill(grid: string[][], x: number, y: number, letter: string, visited: Set<string>): Shape {
    // Position is out of grid
    // No area, but 1 perimeter (edge of grid)
    if (!in_bounds(grid, x, y)) {
        return {area: 0, perimeter: 1};
    }

    const posKey = `${x},${y}`
    // Already visited this position
    if (visited.has(posKey)) {
        return {area: 0, perimeter: 0};
    }

    // Position is not part of current letter
    // There is 1 perimeter between them
    if (letter !== grid[x][y]) {
        return {area: 0, perimeter: 1};
    }

    visited.add(posKey);
    // Count ourselves as 1 area
    const current: Shape = {area: 1, perimeter: 0};
    // Check each direction in the grid from current position
    for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        const next = fill(grid, nx, ny, letter, visited);
        current.area += next.area;
        current.perimeter += next.perimeter;
    }
    return current;
}

const grid = parse_file('./day12/input.txt');
let cost = 0;

for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
        const letter = grid[row][col];
        // We have already visited this plot, so skip it
        if (letter === '.') {
            continue;
        }

        const visited = new Set<string>();
        // Recursively fill from the current letter to all other same letters
        // around it.
        const shape = fill(grid, row, col, letter, visited);

        cost += shape.area * shape.perimeter;

        // Mark all visited positions of this letter as a dot
        // So that they are skipped next time they are discovered
        for (const pos of visited.values()) {
            const [x, y] = pos.split(',').map(Number);
            grid[x][y] = '.'
        }
    }
}

console.log(cost);
