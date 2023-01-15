
import { map500x500 } from './maps/maps.js';
import { getPath, makeGrid } from '../src/index.js';
import process from 'node:process';

const queries500x500 = [
    [6, 12, 499, 499], [1, 1, 498, 498],
    [0, 0, 497, 497], [1, 1, 320, 498],
    [12, 12, 383, 484], [0, 0, 496, 499],
    [1, 1, 8, 498], [3, 0, 499, 499],
    [12, 12, 320, 498], [10, 10, 466, 464]
];

// loops counters
const gridCycles = 10;
const pathsCycles = 20;
let totalCycles = gridCycles + pathsCycles;
let cycles = 0;

// Memory delta values
let gridMem = [];
let pathsMem = [];

let grid = null;

if (typeof gc !== 'function') {
    console.log('Node flag --expose-gc is required. Try :\nnode --expose-gc ./pathToScript');
    process.exit();
}

function printR(str) {
    process.stdout.write('    \r');
    process.stdout.write(str + '\r');
}

function shutdown() {
    console.log('--- Memory use after grid creation (Kb) ---' +
        '\n Average: ' + Math.floor(gridMem.reduce((a, b) => (a + b)) / gridMem.length) +
        '\n Max: ' + Math.max(...gridMem) +
        '\n Min: ' + Math.min(...gridMem));
    console.log('--- Memory use after paths creation (Kb) ---' +
        '\n Average: ' + Math.floor(pathsMem.reduce((a, b) => (a + b)) / pathsMem.length) +
        '\n Max: ' + Math.max(...pathsMem) +
        '\n Min: ' + Math.min(...pathsMem));
    process.exit();
}

function loopPaths() {
    cycles++;
    let m2 = Math.floor(process.memoryUsage().heapUsed / 1024);
    let paths = [];
    queries500x500.forEach(q => {
        let p = getPath(grid, q[0], q[1], q[2], q[3]);
        paths.push(p);
    });
    let m3 = Math.floor(process.memoryUsage().heapUsed / 1024);
    pathsMem.push(m3 - m2);
    printR(1 + totalCycles--);

    if (cycles > pathsCycles) shutdown();

    gc();
    setTimeout(loopPaths, 500);
}

function loopGrid() {
    cycles++;
    let m0 = Math.floor(process.memoryUsage().heapUsed / 1024);
    grid = makeGrid(map500x500);
    let m1 = Math.floor(process.memoryUsage().heapUsed / 1024);
    gridMem.push(m1 - m0);
    printR(1 + totalCycles--);

    if (cycles > gridCycles) {
        gc();
        cycles = 0;
        loopPaths();
        return;
    }
    gc();
    setTimeout(loopGrid, 500);
}

gc();
loopGrid();