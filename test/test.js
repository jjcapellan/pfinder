import process from 'node:process';
import { makeGrid, getPath } from '../src/index.js';
import { map4x4, map8x8, map8x12, map40x40, map500x500 } from './maps/maps.js';
import { genqueriesArray } from './testutils.js';

function checkPath(path, x0, y0, x1, y1) {
    if (!path) return false;
    let start = path[0];
    let end = path[path.length - 1];
    if (start.x != x0 || start.y != y0 || end.x != x1 || end.y != y1) return false;
    return true;
}

function test(grid, x0, y0, x1, y1, isNull) {
    let width = grid[0].length;
    let height = grid.length;
    let path = getPath(grid, x0, y0, x1, y1);
    console.log(`\n---- Test getPath on ${width}x${height} grid ----`);
    if ((!path && isNull) || (checkPath(path, x0, y0, x1, y1) && !isNull)) {
        if (!isNull) {
            console.log(`Returned valid path of length ${path.length}`);
        } else {
            console.log(`Returned null. The destination is not reachable.`);
        }
        console.log(path);
        console.log(`****** TEST PASSED ******`);
    } else {
        console.log(x0, y0, x1, y1); console.log(path);
        console.log('****** TEST FAILED ******');
        process.exit(1);
    }
}

// Valid paths
let queries40x40 = [
    [0, 0, 39, 39], [0, 0, 36, 39], [2, 0, 39, 39],
    [2, 0, 36, 39], [5, 10, 39, 39], [5, 10, 36, 39],
    [0, 0, 30, 37], [2, 0, 30, 37], [5, 10, 30, 37],
    [0, 39, 39, 0]
];

// Valid paths
let queries500x500 = [
    [6, 12, 499, 499], [1, 1, 498, 498],
    [0, 0, 497, 497], [1, 1, 320, 498],
    [12, 12, 383, 484], [0, 0, 496, 499],
    [1, 1, 8, 498], [3, 0, 499, 499],
    [12, 12, 320, 498], [10, 10, 466, 464]
];

let grid;
grid = makeGrid(map4x4);
test(grid, 0, 0, 3, 3, true);

grid = makeGrid(map8x8);
test(grid, 0, 0, 5, 6);
test(grid, 0, 0, 6, 6, true);

grid = makeGrid(map8x12);
test(grid, 0, 0, 5, 9);

grid = makeGrid(map40x40);
queries40x40.forEach(q => test(grid, q[0], q[1], q[2], q[3]));

grid = makeGrid(map500x500);
queries500x500.forEach(q => test(grid, q[0], q[1], q[2], q[3]));

console.log('****** testing circular paths ******');

grid = makeGrid(map500x500);
queries500x500 = genqueriesArray(10000, 500, 500);
queries500x500.forEach(q => {
    process.stdout.write('                               \r');
    process.stdout.write(`${q[0]} ${q[1]} ${q[2]} ${q[3]}` + '\r');
    getPath(grid, q[0], q[1], q[2], q[3]);
});
console.log('****** TEST PASSED ******');