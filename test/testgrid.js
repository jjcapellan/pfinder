import { makeGrid } from '../src/grid.js';

const map = [
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0, 0, 1, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
];

function printGrid(grid) {
    let width = grid[0].length;
    let height = grid.length;
    console.log(`****** GRID ${width}x${height}: x y distances flag jump ******`);
    for (let y = 0; y < height; y++) {
        const row = grid[y];
        row.forEach((n, x) => {
            if (!n) return;
            let x0 = x.toString();
            let y0 = y.toString();
            let dst = n.distances.toString();
            let flag = n.jFlag.toString(2);
            let jump = n.jump;
            console.log(x0 + '|' + y0 + '|' + dst + '|' + flag + '|' + jump);
        });
    }
}

printGrid(makeGrid(map));