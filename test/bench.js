import { makeGrid, getPath } from '../src/index.js';
import { map8x8, map40x40 } from './maps.js';

const grid40x40 = makeGrid(map40x40);
const grid8x8 = makeGrid(map8x8);

function benchmark(n, grid, x1, y1) {
    const width = grid[0].length;
    const height = grid.length;
    let t0 = performance.now();
    for (let i = 0; i < n; i++) {
        const x0 = 0, y0 = 0;
        let path = getPath(grid8x8, x0, y0, x1, y1);
    }
    let duration = performance.now() - t0;
    console.log(`\n---- BENCHMARK getPath() ${width}x${height} ----`);
    console.log(`${n} runs of getPath() in ${duration} milliseconds. (${Math.round(n / duration)} ops/ms)`);
}

benchmark(1000, grid40x40, 39, 39);
//benchmark(1000, grid8x8, 5, 6);
