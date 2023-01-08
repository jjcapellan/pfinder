import process from 'node:process';
import { makeGrid, getPath } from '../src/index.js';
import { map4x4, map8x8, map8x12, map40x40 } from './maps.js';
import { map500x500 } from './map500x500.js';

const grid4x4 = makeGrid(map4x4);
const grid8x8 = makeGrid(map8x8, true);
const grid8x12 = makeGrid(map8x12);
const grid40x40 = makeGrid(map40x40);
const grid500x500 = makeGrid(map500x500);

function checkPath(grid, path, x0, y0, x1, y1) {
    let start = path[0];
    let end = path[path.length - 1];
    if (start.x != x0 || start.y != y0 || end.x != x1 || end.y != y1) return false;
    for (let i = 0; i < path.length; i++) {
        let prev = path[i - 1];
        let n = path[i];
        if (grid[n.y][n.x].isWall) return false;
        if (prev) {
            if (Math.abs(prev.x - n.x) > 1 || Math.abs(prev.y - n.y) > 1) return false;
        }
    }
    return true;
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
        console.log('****** TEST FAILED ******');
        process.exit(1);
    }
}

test(grid4x4, 0, 0, 3, 3, true);
test(grid8x8, 0, 0, 5, 6);
test(grid8x8, 0, 0, 6, 6, true);
test(grid8x12, 0, 0, 5, 9);
test(grid40x40, 0, 0, 39, 39);
test(grid40x40, 7, 18, 6, 29);
test(grid500x500, 6, 12, 499, 499);

