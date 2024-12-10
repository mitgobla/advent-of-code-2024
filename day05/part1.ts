import { readFileSync } from "fs";



function split_and_parse(input: string, separator: string): number[] {
    return input.split(separator).map(Number);
}

export function parse_file(filePath: string):[number[][], number[][]] {

    const data = readFileSync(filePath, 'utf-8');

    const [ruleString, updateString] = data.split('\n\n');

    const ruleSplit: string[] = ruleString.split('\n');
    const updateSplit: string[] = updateString.split('\n');

    const rules: number[][] = [];
    const updates: number[][] = [];

    for (const rule of ruleSplit) {
        // rule = '12|34'
        rules.push(split_and_parse(rule, '|'));
    }

    for (const update of updateSplit) {
        updates.push(split_and_parse(update, ','));
    }

    return [rules, updates]
}

const [rules, updates] = parse_file('./day5/input.txt');

export function check_valid(update: number[]): boolean {
    // update = [12, 34, 56, 78]
    const pagesInUpdate = new Set<number>(update);
    // pagesInUpdate = {12, 34, 56, 78}
    const found = new Set<number>();
    for (const value of update) {
        // value = 12
        found.add(value);
        for (const rule of rules) {
            const [before, after] = rule;
            if (value == before && pagesInUpdate.has(after)) {
                // Rule is part of this update
                // i.e. 12|34 would be valid as 12 and 34 are in the pages
                // This rule says that 12 must be before 34. Check if 34 exists in found
                if (found.has(after)) {
                    // Not valid
                    return false;
                }
            }
        }
    }
    return true;
}

let total = 0;

for (const update of updates) {
    if (check_valid(update)) {
        const middle = update[Math.floor(update.length / 2)]
        total += middle;
    }
}

console.log(total);
