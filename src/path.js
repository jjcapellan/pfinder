/**
* @copyright    2023 Juan Jose Capellan
* @license      {@link https://github.com/jjcapellan/pfinder/blob/master/LICENSE | MIT License}
*/

import { Heap } from './heap.js';
import { getBit } from './grid.js';

// Node.hash: allow reuse the grid. nhash identifies unique search operation
let nhash = 0;

let pathsPerFrame = 20;

const queue = [];

// |0|1|2|
// |7|n|3| Valid directionr for each exploration direction
// |6|5|4|
const dirFilter = [
    [7, 0, 1],
    [7, 0, 1, 2, 3],
    [1, 2, 3],
    [1, 2, 3, 4, 5],
    [3, 4, 5],
    [3, 4, 5, 6, 7],
    [5, 6, 7],
    [5, 6, 7, 0, 1]
];

// unit vectors advance in each direction (v * distance * y, h * distance * x)
const dirParams = [
    { v: -1, h: -1 },
    { v: -1, h: 0 },
    { v: -1, h: 1 },
    { v: 0, h: 1 },
    { v: 1, h: 1 },
    { v: 1, h: 0 },
    { v: 1, h: -1 },
    { v: 0, h: -1 },
];

// lookup table for checkdir
const dirsTable = [0, 1, 2, 7, null, 3, 6, 5, 4];

function generatePath(node) {
    const path = [];
    let current = node;
    let i = 0;
    while (current) {
        path[i++] = { x: current.x, y: current.y };
        current = current.parent;
    };

    return path.reverse();
}

function getH(node, x1, y1) {
    let dx = Math.abs(node.x - x1);
    let dy = Math.abs(node.y - y1);
    // h = D * (dx + dy) + (sqrt(D^2 + D^2) - 2 * D) * min(dx, dy)
    return (10 * (dx + dy) - 5.857 * Math.min(dx, dy)) | 0; // valid for 32bit integers (max: 4,294,967,295 )
}

function getDirection(p, n) {
    // |0|1|2|
    // |p|n|3|
    // |6|5|4|
    const dx = n.x - p.x;
    const dy = n.y - p.y;
    if (dx < 0) {
        if (dy < 0) return 0;
        if (dy == 0) return 7;
        if (dy > 0) return 6;
    }
    if (dx == 0) {
        if (dy < 0) return 1;
        if (dy > 0) return 5;
    }
    if (dx > 0) {
        if (dy < 0) return 2;
        if (dy == 0) return 3;
        if (dy > 0) return 4;
    }
}

function getNext(grid, node, distance, dir) {
    let p = dirParams[dir];
    return grid[node.y + p.v * distance][node.x + p.h * distance];
}

// Checks if target is in sigh exploring in current direction
function checkDir(node, target, dir) {
    let dx = Math.sign(target.x - node.x);
    let dy = Math.sign(target.y - node.y);

    return dirsTable[4 + dx + 3 * dy] == dir;
}

function checkTarget(node, target, dir, distance) {
    const x1 = target.x;
    const y1 = target.y;
    if (checkDir(node, target, dir) && distance >= Math.abs(node.x - x1) && distance >= Math.abs(node.y - y1)) {
        return true;
    }
    return false;
}

function resetNode(node, hash) {
    node.hash = hash;
    node.parent = null;
    node.inOpen = false;
    node.inClose = false;
    node.g = 0;
    node.f = 0;
}

function getBranchJump(grid, node, target, best, dist, dir, j) {
    let next = getNext(grid, node, dist, dir);
    if (next.hash != nhash) resetNode(next, nhash);

    let nodeG = best.g + j * Math.SQRT2;
    let nextG = nodeG + dist;
    let validPath = true;

    if ((next.inClose || (next.inOpen && next.g <= nextG)) || (node.inOpen && node.g <= nodeG)) {
        validPath = false;
    }

    if (validPath) {

        node.parent = best;
        node.g = nodeG;
        node.inOpen = true;

        next.parent = node;
        next.g = nextG;
        next.f = nextG + getH(next, target.x, target.y);

        if (!next.inOpen) {
            return next;
        }

        return null;

    }

    return null;
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

    if (!grid[y0][x0] || !grid[y1][x1]) return null;

    const allDirs = [0, 1, 2, 3, 4, 5, 6, 7];
    const target = grid[y1][x1];
    const openSet = new Heap('f', 100, 10);

    nhash++;

    // Initial node
    const startNode = grid[y0][x0];
    resetNode(startNode, nhash);
    openSet.push(startNode);

    while (openSet.count) {

        // Extract best node
        let best = openSet.pop();
        best.inOpen = false;
        best.inClose = true;

        if (best.x == x1 && best.y == y1) {
            return generatePath(best);
        }

        // Select valid directions for current exploration direction
        const dirs = best.parent ? dirFilter[getDirection(best.parent, best)] : allDirs;


        for (let i = 0; i < dirs.length; i++) {
            const d = dirs[i]; // 0..7
            const p = dirParams[d]; // {v,h} vertical and horizontal multipliers
            const distance = best.distances[d];

            if (distance) {
                // checks main direction
                if (checkTarget(best, target, d, distance)) {
                    target.parent = best;
                    return generatePath(target);
                }

                // If diagonal direction (0,3,4, or 6)
                if (d % 2 == 0) {
                    // |0|A|M|
                    // |7|n|B|
                    // |p|5|4|
                    // diagonal has three directions (2 branches(A,B) + 1 main(M))
                    let dirA = dirFilter[d][0];
                    let dirB = dirFilter[d][2];

                    // Diagonal expansion
                    //   ||/--
                    //   |/---
                    //   n----
                    for (let j = 1; j <= distance; j++) {
                        const node = grid[best.y + p.v * j][best.x + p.h * j];
                        let distA = node.distances[dirA];
                        let distB = node.distances[dirB];

                        if (node.hash != nhash) resetNode(node, nhash);

                        // Does diagonal finish in jump node? 
                        if (j == distance && node.jump) {
                            let nodeG = best.g + j * Math.SQRT2;
                            if (node.inClose || (node.inOpen && node.g <= nodeG)) continue;
                            node.parent = best;
                            node.g = nodeG;
                            node.f = nodeG + getH(node, x1, y1);

                            if (!node.inOpen) {
                                node.inOpen = true;
                                node.inClose = false;
                                openSet.push(node);
                            }
                            continue;
                        }

                        // Checks branch A
                        if (distA) {
                            // Checks direction end
                            if (checkTarget(node, target, dirA, distA)) {
                                node.parent = best;
                                target.parent = node;
                                return generatePath(target);
                            }

                            // Is there a jump in this direction?
                            if (getBit(node, dirA)) {
                                let next = getBranchJump(grid, node, target, best, distA, dirA, j);
                                if (next) {
                                    next.inOpen = true;
                                    next.inClose = false;
                                    openSet.push(next);
                                }
                            }

                        }

                        // Checks branch B
                        if (distB) {
                            if (checkTarget(node, target, dirB, distB)) {
                                node.parent = best;
                                target.parent = node;
                                return generatePath(target);
                            }

                            if (getBit(node, dirB)) {
                                let next = getBranchJump(grid, node, target, best, distB, dirB, j);
                                if (next) {
                                    next.inOpen = true;
                                    next.inClose = false;
                                    openSet.push(next);
                                }
                            }
                        }
                    }
                } // end if(d%2 == 0)

                // CHecks for jump in orthogonal direction
                if (d % 2 != 0 && getBit(best, d)) {

                    let next = getNext(grid, best, distance, d);
                    if (next.hash != nhash) resetNode(next, nhash);

                    let nextG = best.g + distance;
                    if (next.inClose || (next.inOpen && next.g <= nextG)) {
                        continue;
                    }

                    next.parent = best;
                    next.g = nextG;
                    next.f = nextG + getH(next, x1, y1);

                    if (!next.inOpen) {
                        next.inOpen = true;
                        next.inClose = false;
                        openSet.push(next);
                    }
                }
            }
        }// end for
    } // end while
    return null;
}

/**
 * Sets the number of max paths calculated in one frame
 * @param {number} n Max number of paths calculated in one frame. For example, 
 * if n == 20, that means that in a game running at 60 FPS, 1200 (60x20) paths 
 * per second will be calculated.  
 */
function setMaxPathsPerFrame(n) {
    n = Math.max(0, n);
    pathsPerFrame = n;
}

/**
 * Calls getPath() asynchronously.
 * Specifically, it creates a task and adds it to a queue. This task will be 
 * executed after call update() method.
 * @param {Object[][]} grid 2d array of nodes
 * @param {number}     x0 x-coordinate of the path origin
 * @param {number}     y0 y-coordinate of the path origin
 * @param {number}     x1 x-coordinate of the path end
 * @param {number}     y1 y-coordinate of the path end
 * @param {function}   callback callback function which receives the path as parameter 
 */
function getPathAsync(grid, x0, y0, x1, y1, callback) {
    queue.push([grid, x0, y0, x1, y1, callback]);
}

/**
 * Starts the tasks stored in the task queue. At most it will execute the 
 * MaxPathsPerFrame tasks.
 */
function update() {
    for (let i = 0; i < pathsPerFrame; i++) {
        let t = queue.shift();
        if (!t) break;
        let p = getPath(t[0], t[1], t[2], t[3], t[4]);
        t[5](p);
    }
}

export { getPath, getPathAsync, setMaxPathsPerFrame, update };