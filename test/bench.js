import { makeGrid, getPath, getPathFromCache, setMaxCacheSize } from '../src/index.js';
import { map40x40, map8x8 } from './maps.js';
import { map500x500 } from './map500x500.js';
import { queries40x40 } from './queries40x40.js';
import { queries8x8 } from './queries8x8.js';
import { queries500x500 } from './queries500x500.js';

//const grid40x40 = makeGrid(map40x40);
//const grid8x8 = makeGrid(map8x8);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let grid500x500 = makeGrid(map500x500);
sleep(100);

////
//// ****** TEST getPath() FOR 10 VALID LONG PATHS ON 500X500 MAP ******
////////////////////

// All this paths are not null
let points = [
    [6, 12, 499, 499], [1, 1, 498, 498],
    [0, 0, 497, 497], [1, 1, 320, 498],
    [12, 12, 400, 499], [0, 0, 496, 499],
    [1, 1, 8, 498], [3, 0, 499, 499],
    [12, 12, 320, 498], [10, 10, 466, 464]
];
// warmup
getPath(grid500x500, 12, 12, 466, 464);
getPath(grid500x500, 10, 10, 320, 498);

console.log(`****** TEST getPath() FOR 10 VALID LONG PATHS ON 500X500 MAP ******`);
let duration = 0;
for (let i = 0; i < points.length; i++) {
    let p = points[i];
    let t0 = performance.now();
    let path = getPath(grid500x500, p[0], p[1], p[2], p[3]);
    let dt = performance.now() - t0;
    console.log(`Path ${i} of length ${path.length} resolved in ${Math.round(dt)}ms`);
    duration += dt;
}
console.log(`getPath() average time(ms) for 500x500 map: ${Math.round(duration / points.length)}`);



////
//// ****** TEST getPathFromCache() FOR 20 VALID LONG REPEATED PATHS ON 500X500 MAP ******
////////////////////

// All this paths are not null
points = [
    [6, 12, 499, 499], [1, 1, 498, 498],
    [0, 0, 497, 497], [1, 1, 320, 498],
    [12, 12, 400, 499], [0, 0, 496, 499],
    [1, 1, 8, 498], [3, 0, 499, 499],
    [12, 12, 320, 498], [10, 10, 466, 464],
    [6, 12, 499, 499], [1, 1, 498, 498],
    [0, 0, 497, 497], [1, 1, 320, 498],
    [12, 12, 400, 499], [0, 0, 496, 499],
    [1, 1, 8, 498], [3, 0, 499, 499],
    [12, 12, 320, 498], [10, 10, 466, 464]
];


// warmup
getPathFromCache(grid500x500, 12, 12, 466, 464);
getPathFromCache(grid500x500, 10, 10, 320, 498);

console.log(`\n****** TEST getPathFromCache() FOR 20 VALID LONG REPEATED PATHS ON 500X500 MAP ******`);
duration = 0;
for (let i = 0; i < points.length; i++) {
    let p = points[i];
    let t0 = performance.now();
    let path = getPathFromCache(grid500x500, p[0], p[1], p[2], p[3]);
    let dt = performance.now() - t0;
    console.log(`Path ${i} of length ${path.length} resolved in ${Math.round(dt)}ms`);
    duration += dt;
}
console.log(`getPath() average time(ms) for 500x500 map: ${Math.round(duration / points.length)}`);