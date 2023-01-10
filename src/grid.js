/**
* @copyright    2023 Juan Jose Capellan
* @license      {@link https://github.com/jjcapellan/pfinder/blob/master/LICENSE | MIT License}
*/

function makeNode(x, y) {
    return {
        x: x,
        y: y,
        parent: null,
        children: [],
        inOpen: false,
        inClose: false,
        g: 0,
        f: 0
    };
}

/**
 * Converts 2d array of numbers to 2d array of nodes
 * @param {number[][]} map2d 2d array of numbers representing a 2d space (0 = walkable, non 0 = obstacle)
 * @param {boolean} [allowCorners = false] should path pass through corners?
 * @returns {Object[][]} 2d array of nodes used by other functions to search paths
 */
function makeGrid(map2d, allowCorners) {
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

    // Calc neighbors
    for (let i = 0; i < height; i++) {
        let row = grid[i];
        row.forEach((n, idx) => {
            if (!n) return;
            let children = [];
            let up = false, down = false, left = false, right = false;
            let uw = false, dw = false, lw = false, rw = false;
            if (idx > 0) {
                let node = row[idx - 1];
                left = true;
                if (!node) lw = true;
                if (node) children.push(node);
            }
            if (idx < width - 1) {
                let node = row[idx + 1];
                right = true;
                if (!node) rw = true;
                if (node) children.push(node);
            }
            if (i > 0) {
                let node = grid[i - 1][idx];
                up = true;
                if (!node) uw = true;
                if (node) children.push(node);
            }
            if (i < height - 1) {
                let node = grid[i + 1][idx];
                down = true;
                if (!node) dw = true;
                if (node) children.push(node);
            }

            if (allowCorners) {
                if ((up && left)) {
                    let node = grid[i - 1][idx - 1];
                    if (node) children.push(node);
                }
                if ((up && right)) {
                    let node = grid[i - 1][idx + 1];
                    if (node) children.push(node);
                }
                if ((down && left)) {
                    let node = grid[i + 1][idx - 1];
                    if (node) children.push(node);
                }
                if ((down && right)) {
                    let node = grid[i + 1][idx + 1];
                    if (node) children.push(node);
                }
            } else {
                if ((up && left) && !(uw || lw)) {
                    let node = grid[i - 1][idx - 1];
                    if (node) children.push(node);
                }
                if ((up && right) && !(uw || rw)) {
                    let node = grid[i - 1][idx + 1];
                    if (node) children.push(node);
                }
                if ((down && left) && !(dw || lw)) {
                    let node = grid[i + 1][idx - 1];
                    if (node) children.push(node);
                }
                if ((down && right) && !(dw || rw)) {
                    let node = grid[i + 1][idx + 1];
                    if (node) children.push(node);
                }
            }
            grid[i][idx].children = children;
        }); // end foreach
    } // end for

    return grid;

}

export { makeGrid };