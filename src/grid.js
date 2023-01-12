/**
* @copyright    2023 Juan Jose Capellan
* @license      {@link https://github.com/jjcapellan/pfinder/blob/master/LICENSE | MIT License}
*/
import { setOrthogonalDistances, setDiagonalDistances } from './jps.js';

function makeNode(x, y) {
    return {
        x: x,
        y: y,
        parent: null,
        distances: [],
        jFlag: 0,
        jump: false,
        inOpen: false,
        inClose: false,
        g: 0,
        f: 0,
        hash: 0 // current operation hash
    };
};

function getBit(node, bit) {
    return (node.jFlag & (1 << bit)) != 0;
}

/**
 * Converts 2d array of numbers to 2d array of nodes
 * @param {number[][]} map2d 2d array of numbers representing a 2d space (0 = walkable, non 0 = obstacle)
 * @returns {Object[][]} 2d array of nodes used by other functions to search paths
 */
function makeGrid(map2d) {
    const height = map2d.length;
    const width = map2d[0].length;
    const grid = [];

    // Populates grid with nodes
    for (let y = 0; y < height; y++) {
        let row = new Array(width).fill(0);
        row.forEach((_, x) => {
            row[x] = map2d[y][x] ? 0 : makeNode(x, y);
        });
        grid.push(row);
    }

    // Calc orthogonal distances and mark jumps
    for (let y = 0; y < height; y++) {
        let row = grid[y];
        row.forEach((n, x) => {
            if (!n) return;

            setOrthogonalDistances(grid, map2d, x, y);

            // |0|1|2|
            // |7|n|3|  Mark jumps
            // |6|5|4|
            const d = grid[y][x].distances;
            const f = grid[y][x].jFlag;
            if (d[1] && getBit(n, 1)) grid[y - d[1]][x].jump = true;
            if (d[3] && getBit(n, 3)) grid[y][x + d[3]].jump = true;
            if (d[5] && getBit(n, 5)) grid[y + d[5]][x].jump = true;
            if (d[7] && getBit(n, 7)) grid[y][x - d[7]].jump = true;
        });
    }

    // Calc diagonal distances (previus mark jumps is required)
    for (let y = 0; y < height; y++) {
        let row = grid[y];
        row.forEach((n, x) => {
            if (!n) return;
            setDiagonalDistances(grid, map2d, x, y);
        });
    }

    return grid;

}

export { getBit, makeGrid };