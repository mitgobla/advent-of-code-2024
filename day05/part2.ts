import { parse_file, check_valid } from "./part1";

const [rules, updates] = parse_file('./day5/input.txt');

function make_valid(update: number[]): number[] {
    // update = [12, 34, 56, 78]
    const pagesInUpdate = new Set<number>(update);
    // pagesInUpdate = {12, 34, 56, 78}

    // Nodes -> numbers in update
    // Children -> numbers that can be after node
    const graph: Map<number, number[]> = new Map();

    // Count of edges that represent Current node -> Next node
    const indegree: Map<number, number> = new Map();

    // Initialize graph and edges
    for (const value of update) {
        graph.set(value, []);
        indegree.set(value, 0);
    }

    // Add indegree edges
    for (const [current, next] of rules) {
        if (pagesInUpdate.has(current) && pagesInUpdate.has(next)) {
            // Add the next as a child to the current in the graph
            graph.get(current)?.push(next);
            // Increment the indegree by 1, default 0
            indegree.set(next, (indegree.get(next) || 0) + 1);
        }
    }

    // Using Kahn's algorithm to topologically sort the graph based on
    // nodes (update numbers) having an indegree count of 0
    // Queue stores nodes that have indegree of 0, process each to reduce indegree count of its children
    const queue: number[] = [];
    // Sorted stores the topological order of the graph after Kahn's algorithm
    const sorted: number[] = [];

    // Get all nodes that have 0 indegree value
    for (const [value, degree] of indegree.entries()) {
        if (degree === 0) {
            queue.push(value);
        }
    }

    // Process queue
    while (queue.length > 0) {
        // Since checking queue length > 0, queue.shift should not return undefined
        const current = queue.shift()!;
        sorted.push(current);

        // Reduce indegree of children, and add to queue if indegree of them are 0
        // Return empty array if no children
        for (const child of graph.get(current) || []) {
            // reduce indegree by 1 of child
            indegree.set(child, (indegree.get(child) || 0) - 1)
            if (indegree.get(child) === 0) {
                // add number to queue as now has indegree of 0
                queue.push(child);
            }
        }
    }

    return sorted;
}


let total = 0;

for (const update of updates) {
    if (!check_valid(update)) {
        const validated = make_valid(update);
        const middle = validated[Math.floor(validated.length / 2)]
        total += middle;
    }
}

console.log(total);