/**
* @copyright    2023 Juan Jose Capellan
* @license      {@link https://github.com/jjcapellan/pfinder/blob/master/LICENSE | MIT License}
*/

////
//// PRIVATE
//////////////////////////////////////////

const cache = new Map();
let maxCacheSize = 1000;

class Heap {
    constructor(prop) {
        this.items = [];
        this.prop = prop;
    }

    push(item) {
        if (!this.items.length) {
            item.inOpen = true;
            this.items.push(item);
            return;
        }

        for (let i = this.items.length - 1; i >= 0; i--) {

            if (this.items[i][this.prop] >= item[this.prop]) {
                this.items.splice(i + 1, 0, item);
                return;
            }
        }

        this.items.unshift(item);
    }
}

function generatePath(node, x0, y0) {
    const path = [];
    let current = node;
    while (current) {
        path.push({ x: current.x, y: current.y });
        if (current.x == x0 && current.y == y0) break;
        current = current.parent;
    }

    return path.reverse();
}

function getH(node, x1, y1) {
    let dx = Math.abs(node.x - x1);
    let dy = Math.abs(node.y - y1);
    // h = D * (dx + dy) + (sqrt(D^2 + D^2) - 2 * D) * min(dx, dy)
    return 10 * (dx + dy) - 5.857 * Math.min(dx, dy);
}

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

function savePath(path, x0, y0, x1, y1) {
    if (cache.size > maxCacheSize) {
        cache.delete(cache.keys().next().value);
    }
    let key = x0 + '.' + y0 + '.' + x1 + '.' + y1;
    cache.set(key, path);
}

////
//// PLUBLIC API
//////////////////////////////////////////

/**
 * Converts 2d array of numbers to 2d array of nodes
 * @param {number[][]} map2d 2d array of numbers representing a 2d space (0 = walkable, non 0 = obstacle)
 * @returns {Object[][]} 2d array of nodes used by other functions to search paths
 */
function makeGrid(map2d) {
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
            grid[i][idx].children = children;
        }); // end foreach
    } // end for

    return grid;

}

/**
 * Calculates the required path from a grid
 * @param {Object[][]} grid 2d array of nodes
 * @param {number} x0 x-coordinate of the path origin
 * @param {number} y0 y-coordinate of the path origin
 * @param {number} x1 x-coordinate of the path end
 * @param {number} y1 y-coordinate of the path end
 * @returns {(Object[] | null)} Required path as an array of points (example: [{x: x0,y: y0}, {x: 2, y: 3}, ... , {x: x1, y: y1}]). 
 * If required path is not found, returns null.
 */
function getPath(grid, x0, y0, x1, y1) {

    if (grid[y0][x0].isWall || grid[y1][x1].isWall) return null;

    let signature = Math.random();
    grid[y0][x0].signature = signature;
    grid[y0][x0].inOpen = false;
    grid[y0][x0].inClose = false;

    const openSet = new Heap('f');

    // Initial node
    openSet.push(grid[y0][x0]);

    while (openSet.items.length) {
        // Extract best node
        let bestNode = openSet.items.pop();
        bestNode.inOpen = false;

        // Add best to closedSet
        bestNode.inClose = true;

        // If solution found
        if (bestNode.x == x1 && bestNode.y == y1) {
            return generatePath(bestNode, x0, y0);
        }

        // Checks neighbors
        let children = bestNode.children;
        children.forEach(n => {
            if (n.signature != signature) {
                n.signature = signature;
                n.inClose = false;
                n.inOpen = false;
                n.f = 0;
                n.g = 0;
            }
            if (n.inClose) return;


            let g = bestNode.g + 1;
            if (n.g < g) {
                n.parent = bestNode;
                n.g = g;
                n.f = g + getH(n, x1, y1);
                if (!n.inOpen) {
                    openSet.push(n);
                }
            }
        });

    }// end while

    return null;
}

/**
 * Calculates the required path from a grid, using cache to improve performance.
 * @param {Object[][]} grid 2d array of nodes
 * @param {number} x0 x-coordinate of the path origin
 * @param {number} y0 y-coordinate of the path origin
 * @param {number} x1 x-coordinate of the path end
 * @param {number} y1 y-coordinate of the path end
 * @returns {(Object[] | null)} Required path as an array of points (example: [{x: x0,y: y0}, {x: 2, y: 3}, ... , {x: x1, y: y1}]). 
 * If required path is not found, returns null.
 */
function getPathFromCache(grid, x0, y0, x1, y1) {
    if (grid[y0][x0].isWall || grid[y1][x1].isWall) return null;

    let p = cache.get(x0 + '.' + y0 + '.' + x1 + '.' + y1);
    if (p !== undefined) {
        return p;
    }

    p = getPath(grid, x0, y0, x1, y1);
    savePath(p, x0, y0, x1, y1);

    return p;
}

/**
 * Sets the number of max stored paths in cache
 * @param {number} size number of max stored paths in cache
 */
function setMaxCacheSize(size) {
    maxCacheSize = size;
}


////
//// EXPORT CODE
//////////////////////////////////////////

if (typeof window != 'undefined') {
    globalThis.Pfinder = {
        getPath: getPath,
        getPathFromCache: getPathFromCache,
        makeGrid: makeGrid,
        setMaxCacheSize: setMaxCacheSize
    };
}

export { getPath, getPathFromCache, makeGrid, setMaxCacheSize };