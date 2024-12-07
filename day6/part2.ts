import { parse_file, find_start_pos, directions, in_bounds } from "./part1";

const puzzleMap = parse_file('./day6/input.txt');

// 1. Go through the grid, and additionally track the direction when visiting a tile
let [currentRow, currentCol, currentDir] = find_start_pos(puzzleMap);
const [startRow, startCol, startDir] = [currentRow, currentCol, currentDir];
//puzzleMap[currentRow] = replace_char(puzzleMap[currentRow], '.', currentCol);
const visited = new Set<string>();

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
            if (!visited.has(`${currentRow},${currentCol},${currentDir}`)) {
                // New tile & direction is not visited before, increment step
                visited.add(`${currentRow},${currentCol},${currentDir}`);
            }
            currentRow = nextRow;
            currentCol = nextCol;
        }
    } else {
        // Next position is out of map, so the guard will leave
        break;
    }
}


function is_loop(obsRow: number, obsCol: number) : boolean {
    const visitedAgain = new Set<string>();
    [currentRow, currentCol, currentDir] = [startRow, startCol, startDir];
    while (in_bounds(puzzleMap, currentRow, currentCol)) {
        const instruction = directions.get(currentDir)!;
        const [nextRow, nextCol] = [currentRow + instruction.nextRow, currentCol + instruction.nextCol];
        if (in_bounds(puzzleMap, nextRow, nextCol)) {
            // Check for obstacle or the newly added obstacle
            if (puzzleMap[nextRow][nextCol] === '#' || (nextRow === obsRow && nextCol === obsCol)) {
                // Change the direction we are facing
                currentDir = instruction.nextDir;
            } else {
                // We can move a step forward
                // Only increment steps if current position is not visited before
                if (!visitedAgain.has(`${currentRow},${currentCol},${currentDir}`)) {
                    // New tile & direction is not visited before, increment step
                    visitedAgain.add(`${currentRow},${currentCol},${currentDir}`);
                } else {
                    // We've encountered a path we've already taken before!
                    return true;
                }
                currentRow = nextRow;
                currentCol = nextCol;
            }
        } else {
            // Next position is out of map, so the guard will leave
            return false;
        }
    }
    return false;
}


let count = 0;
const confirmedObstacles = new Set<string>();

// 2. Go through each visited tile, placing an obstacle in front
for (const element of visited) {
    const [rowStr, colStr, dir] = element.split(',');
    // Get the position to place the obstacle
    const obsDirection = directions.get(dir)!
    const obsRow = parseInt(rowStr) + obsDirection.nextRow;
    const obsCol = parseInt(colStr) + obsDirection.nextCol;

    if (is_loop(obsRow, obsCol)) {
        if (!confirmedObstacles.has(`${obsRow},${obsCol}`)) {
            count++;
            confirmedObstacles.add(`${obsRow},${obsCol}`);
        }
    }
}

console.log(count);
