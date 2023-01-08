function makeNode(x, y, isWall) {
    return {
        x: x,
        y: y,
        parent: null,
        children: [],
        isWall: isWall,
        inOpen: false,
        inClose: false,
        g: 0,
        f: 0
    };
}

/**
 * Converts 2d array of numbers to 2d array of nodes
 * @param {number[][]} map2d 2d array of numbers representing a 2d space (0 = walkable, non 0 = obstacle)
 * @param {boolean} [allowCross = false] can path cross in diagonal between two corners?
 * @returns {Object[][]} 2d array of nodes used by other functions to search paths
 */
function makeGrid(map2d, allowCross) {
    const width = map2d.length;
    const height = map2d[0].length;
    const grid = [];

    // Populates grid with nodes
    for (let y = 0; y < height; y++) {
        let row = new Array(width).fill(0);
        row.forEach((_, x) => {
            row[x] = makeNode(x, y, map2d[y][x]);
        });
        grid.push(row);
    }

    // Calc neighbors
    for (let i = 0; i < height; i++) {
        let row = grid[i];
        row.forEach((n, idx) => {
            let children = [];
            let up = false, down = false, left = false, right = false;
            let uw = false, dw = false, lw = false, rw = false;
            if (idx > 0) {
                let node = row[idx - 1];
                left = true;
                if (node.isWall) lw = true;
                if (!node.isWall) children.push(node);
            }
            if (idx < width - 1) {
                let node = row[idx + 1];
                right = true;
                if (node.isWall) rw = true;
                if (!node.isWall) children.push(node);
            }
            if (i > 0) {
                let node = grid[i - 1][idx];
                up = true;
                if (node.isWall) uw = true;
                if (!node.isWall) children.push(node);
            }
            if (i < height - 1) {
                let node = grid[i + 1][idx];
                down = true;
                if (node.isWall) dw = true;
                if (!node.isWall) children.push(node);
            }

            if (allowCross) {
                if ((up && left)) {
                    let node = grid[i - 1][idx - 1];
                    if (!node.isWall) children.push(node);
                }
                if ((up && right)) {
                    let node = grid[i - 1][idx + 1];
                    if (!node.isWall) children.push(node);
                }
                if ((down && left)) {
                    let node = grid[i + 1][idx - 1];
                    if (!node.isWall) children.push(node);
                }
                if ((down && right)) {
                    let node = grid[i + 1][idx + 1];
                    if (!node.isWall) children.push(node);
                }
            } else {
                if ((up && left) && !(uw && lw)) {
                    let node = grid[i - 1][idx - 1];
                    if (!node.isWall) children.push(node);
                }
                if ((up && right) && !(uw && rw)) {
                    let node = grid[i - 1][idx + 1];
                    if (!node.isWall) children.push(node);
                }
                if ((down && left) && !(dw && lw)) {
                    let node = grid[i + 1][idx - 1];
                    if (!node.isWall) children.push(node);
                }
                if ((down && right) && !(dw && rw)) {
                    let node = grid[i + 1][idx + 1];
                    if (!node.isWall) children.push(node);
                }
            }
            grid[i][idx].children = children;
        }); // end foreach
    } // end for

    return grid;

}

export { makeGrid };