import { makeGrid, getPath } from '../src/index.js';
import { map40x40 } from './maps.js';
import { map500x500 } from './map500x500.js';

// Valid paths [x0,y0,x1,y1]
const queries40x40 = [
    [0, 0, 39, 39], [0, 0, 36, 39], [2, 0, 39, 39],
    [2, 0, 36, 39], [3, 10, 39, 39], [3, 10, 36, 39],
    [0, 0, 30, 37], [2, 0, 30, 37], [3, 10, 30, 37],
    [0, 39, 39, 0]
];

const queries500x500 = [
    [6, 12, 499, 499], [1, 1, 498, 498],
    [0, 0, 497, 497], [1, 1, 320, 498],
    [12, 12, 400, 499], [0, 0, 496, 499],
    [1, 1, 8, 498], [3, 0, 499, 499],
    [12, 12, 320, 498], [10, 10, 466, 464]
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function bench(grid, queries, func, sleepTime, cycles) {
    const size = queries.length;
    const width = grid[0].length;
    const height = grid.length;
    const q = queries;

    console.log(`\n****** BENCHMARK ${func.name} -> (samples: ${size}, cycles: ${cycles}, grid: ${width}x${height}, delay: ${sleepTime}ms)`);

    const times = [];
    let lastDuration = 0;
    let ready = false;
    let totalTime = 0;
    let warmup = 0;
    let path;
    for (let cycle = 0; cycle < cycles; cycle++) {

        let t0 = performance.now();
        for (let i = 0; i < size; i++) {
            path = func(grid, q[i][0], q[i][1], q[i][2], q[i][3]);
        }
        let duration = performance.now() - t0;


        if (!ready) {
            cycle--;
            warmup++;
            if (!lastDuration || lastDuration > duration) {
                lastDuration = duration;
                continue;
            }
            ready = true;
            continue;
        }

        times.push(duration/size);
        totalTime += duration;
    }

    let runs = size * cycles;
    let average = totalTime / runs;
    console.log(`Warmup cycles: ${warmup}`);
    console.log(`Runs: ${size} samples x ${cycles} cycles = ${runs}`);
    console.log(`Time per run (ms)-> Average: ${average} Max: ${Math.max(...times)} Min: ${Math.min(...times)}`);

}

let grid = null;

console.log('\n****** Using makeGrid(map, true) ******');
console.log('****************************************');
grid = makeGrid(map40x40, true);
await sleep(500);
bench(grid, queries40x40, getPath, 200, 20);
grid = makeGrid(map500x500, true);
await sleep(500);
bench(grid, queries500x500, getPath, 200, 20);

console.log('\n****** Using makeGrid(map, false) ******');
console.log('****************************************');
grid = makeGrid(map40x40);
await sleep(500);
bench(grid, queries40x40, getPath, 200, 20);
grid = makeGrid(map500x500);
await sleep(500);
bench(grid, queries500x500, getPath, 200, 20);
