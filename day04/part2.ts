import { readFileSync } from "fs";

export function parseFile(filePath: string): string[] {
    const data = readFileSync(filePath, 'utf-8');

    return data.split('\n')
}

function count_cross_word(grid: string[]): number {
    let count = 0;

    // Add a 1 border offset since an X formation is not possible on edge positions
    for (let row = 1; row < (grid.length - 1); row++) {
        for (let col = 1; col < (grid[0].length - 1); col++) {
            const element = grid[row][col];
            if (element === 'A') {
                if (grid[row-1][col-1] === 'M' && grid[row-1][col+1] === 'S' && grid[row+1][col-1] === 'M' && grid[row+1][col+1] === 'S') {
                    count++;
                } else if (grid[row-1][col-1] === 'S' && grid[row-1][col+1] === 'S' && grid[row+1][col-1] === 'M' && grid[row+1][col+1] === 'M') {
                    count++;
                } else if (grid[row-1][col-1] === 'M' && grid[row-1][col+1] === 'M' && grid[row+1][col-1] === 'S' && grid[row+1][col+1] === 'S') {
                    count++;
                } else if (grid[row-1][col-1] === 'S' && grid[row-1][col+1] === 'M' && grid[row+1][col-1] === 'S' && grid[row+1][col+1] === 'M') {
                    count++;
                }
            }
        }
    }

    return count;
}

const array = parseFile('./day4/input.txt');

console.log(count_cross_word(array));