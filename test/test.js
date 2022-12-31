import process from 'node:process';
import { makeGrid, getPath } from '../src/index.js';

const map1 = [
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0]
];

const map2 = [
    [0,0,1,0],
    [0,0,1,0],
    [0,0,1,0],
    [0,0,1,0]
]

const grid1 = makeGrid(map1);
const grid2 = makeGrid(map2);

function checkPath(map, path, x0, y0, x1, y1) {
    let start = path[0];
    let end = path[path.length - 1];
    if (start.x != x0 || start.y != y0 || end.x != x1 || end.y != y1) return false;
    for (let i = 0; i < path.length; i++) {
        let prev = path[i - 1];
        let n = path[i];
        if (map[n.y][n.x]) return false;
        if (prev) {
            if (Math.abs(prev.x - n.x) > 1 || Math.abs(prev.y - n.y) > 1) return false;
        }
    }
    return true;
}

function test_map1() {
    let x0 = 0, y0 = 0, x1 = 5, y1 = 6;
    let path = getPath(grid1, x0, y0, x1, y1);
    console.log('\n---- Test getPath on walkable map ----');
    console.log('Result:');
    console.log(path);
    if (checkPath(map1, path, x0, y0, x1, y1)) {
        console.log(`Returned valid path of length ${path.length}\n****** TEST PASSED ******`);
        return true;
    } else {
        console.log('****** TEST FAILED ******');
        process.exit(1);
    }
}

function test_map2() {
    let x0 = 0, y0 = 0, x1 = 3, y1 = 3;
    let path = getPath(grid2, x0, y0, x1, y1);
    console.log('\n---- Test getPath on unsolvable map ----');
    if (!path) {
        console.log(`****** TEST PASSED ******`);
        return true;
    } else {
        console.log('****** TEST FAILED ******');
        process.exit(1);
    }
}

function benchmark_getPath(n) {
    const t0 = performance.now();
    for (let i = 0; i < n; i++) {
        let x0 = 0, y0 = 0, x1 = 5, y1 = 6;
        let path = getPath(grid1, x0, y0, x1, y1);
    }
    let duration = performance.now() - t0;
    console.log('\n---- BENCHMARK getPath() 8x8 ----');
    console.log(`${n} runs of getPath() in ${duration} milliseconds. (${Math.round(n / duration)} ops/ms)`);
}

test_map2();

if (test_map1()) {
    benchmark_getPath(1000);
}

