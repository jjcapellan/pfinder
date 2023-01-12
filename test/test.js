import process from 'node:process';
import { makeGrid, getPath } from '../src/index.js';
import { map4x4, map8x8, map8x12, map40x40 } from './maps.js';
import { map500x500 } from './map500x500.js';

const grid4x4 = makeGrid(map4x4);
const grid8x8 = makeGrid(map8x8);
const grid8x12 = makeGrid(map8x12);
const grid40x40 = makeGrid(map40x40);
const grid500x500 = makeGrid(map500x500);

function checkPath(grid, path, x0, y0, x1, y1) {
    if (!path) return false;
    let start = path[0];
    let end = path[path.length - 1];
    if (start.x != x0 || start.y != y0 || end.x != x1 || end.y != y1) return false;
    return true;
}

function printGrid(grid, x0, y0, x1, y1) {
    for (let y = y0; y <= y1; y++) {
        let row = grid[y];
        const selection = [];
        for (let x = x0; x <= x1; x++) {
            let value = 0;
            if (!row[x]) value = 1;
            selection.push(value);
        }
        console.log(selection.toString());
    }
}

function test(grid, x0, y0, x1, y1, isNull) {
    let width = grid[0].length;
    let height = grid.length;
    let path = getPath(grid, x0, y0, x1, y1);
    console.log(`\n---- Test getPath on ${width}x${height} grid ----`);
    if ((!path && isNull) || (checkPath(grid, path, x0, y0, x1, y1) && !isNull)) {
        if (!isNull) {
            console.log(`Returned valid path of length ${path.length}`);
        } else {
            console.log(`Returned null. The destination is not reachable.`);
        }
        console.log(path);
        console.log(`****** TEST PASSED ******`);
    } else {
        console.log(x0, y0, x1, y1);
        console.log('****** TEST FAILED ******');
        process.exit(1);
    }
}

// Valid paths
const queries500x500 = [
    [6, 12, 499, 499], [1, 1, 498, 498],
    [0, 0, 497, 497], [1, 1, 320, 498],
    [12, 12, 383, 484], [0, 0, 496, 499],
    [1, 1, 8, 498], [3, 0, 499, 499],
    [12, 12, 320, 498], [10, 10, 466, 464]
];

test(grid4x4, 0, 0, 3, 3, true);
test(grid8x8, 0, 0, 5, 6);
test(grid8x8, 0, 0, 6, 6, true);
test(grid8x12, 0, 0, 5, 9);
test(grid40x40, 0, 0, 39, 39);
test(grid40x40, 7, 18, 6, 29);
queries500x500.forEach(q => test(grid500x500, q[0], q[1], q[2], q[3]));

