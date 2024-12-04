import { readFileSync } from "fs";

enum RowDirection {
    Up = -1,
    None = 0,
    Down = 1
}

enum ColDirection {
    Left = -1,
    None = 0,
    Right = 1
}

export function parseFile(filePath: string): string[] {
    const data = readFileSync(filePath, 'utf-8');

    return data.split('\n')
}

function get_letters(grid: string[], row: number, col: number, rowDir: number, colDir: number): string {
    let out = '';
    for (let index = 0; index < 4; index++) {
        const nextRow = row + (rowDir * index);
        const nextCol = col + (colDir * index);

        // Ensure next row/col is in bounds
        if (nextRow >= 0 && nextRow < grid.length && nextCol >= 0 && nextCol < grid[0].length) {
            out += grid[nextRow][nextCol];
        } else {
            break
        }
    }
    return out;
}

function add_if_word(word: string): number {
    if (word === 'XMAS' || word === 'SAMX') {
        return 1;
    }
    return 0;
}

function count_word(grid: string[]): number {
    let count = 0;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const element = grid[row][col];
            if (element === 'X') {

                // Check Upwards
                if (row >= 3) {
                    count += add_if_word(get_letters(grid, row, col, RowDirection.Up, ColDirection.None));
                }

                // Check Downwards
                if (row < grid.length) {
                    count += add_if_word(get_letters(grid, row, col, RowDirection.Down, ColDirection.None));
                }

                // Check Left
                if (col >= 3) {
                    count += add_if_word(get_letters(grid, row, col, RowDirection.None, ColDirection.Left));
                }

                // Check Right
                if (col < grid[0].length) {
                    count += add_if_word(get_letters(grid, row, col, RowDirection.None, ColDirection.Right));
                }

                // Up-Left diagonal
                if (row >= 3 && col >= 3) {
                    count += add_if_word(get_letters(grid, row, col, RowDirection.Up, ColDirection.Left));
                }

                // Down-Left diagonal
                if (row < grid.length && col >= 3) {
                    count += add_if_word(get_letters(grid, row, col, RowDirection.Down, ColDirection.Left));
                }

                // Up-Right diagonal
                if (row >= 3 && col < grid[0].length) {
                    count += add_if_word(get_letters(grid, row, col, RowDirection.Up, ColDirection.Right));
                }

                // Down-Right diagonal
                if (row < grid.length && col < grid[0].length) {
                    count += add_if_word(get_letters(grid, row, col, RowDirection.Down, ColDirection.Right));
                }
            }
        }
    }

    return count;
}


const array = parseFile('./day4/input.txt');

console.log(count_word(array));