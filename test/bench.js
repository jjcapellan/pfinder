import { makeGrid, getPath, getPathFromCache, setMaxCacheSize } from '../src/index.js';
import { map40x40, map8x8 } from './maps.js';
import { queries40x40, queries8x8 } from './queries.js';

const grid40x40 = makeGrid(map40x40);
const grid8x8 = makeGrid(map8x8);

function bench_getPathFuncs(grid, queries, queriesName, name, func) {
    const width = grid[0].length;
    const height = grid.length;
    const size = queries.length;

    console.log(`\n****** BENCHMARK ${name}() USING QUERIES OF ${queriesName} ON A ${width}x${height} GRID OF ${size} QUERIES ******`);

    let t0 = performance.now();
    queries.forEach(q => func(grid, q[0], q[1], q[2], q[3]));
    let duration = performance.now() - t0;

    console.log(`Result: ${size} ${name}() runs in ${duration} milliseconds. (${Math.round((size / duration)*1000)} ops/sec)`);
}

bench_getPathFuncs(grid40x40, queries40x40, '40x40', 'getPath', getPath);
bench_getPathFuncs(grid40x40, queries40x40, '40x40', 'getPathFromCache', getPathFromCache);

bench_getPathFuncs(grid40x40, queries8x8, '8x8', 'getPath', getPath);
bench_getPathFuncs(grid40x40, queries8x8, '8x8', 'getPathFromCache', getPathFromCache);
setMaxCacheSize(64*64); // Maximum number of possible paths for 8x8 grid
bench_getPathFuncs(grid8x8, queries8x8, '8x8', 'getPath', getPath);
bench_getPathFuncs(grid8x8, queries8x8, '8x8', 'getPathFromCache', getPathFromCache);
