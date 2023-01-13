/**
* @copyright    2023 Juan Jose Capellan
* @license      {@link https://github.com/jjcapellan/pfinder/blob/master/LICENSE | MIT License}
*/

import { Heap } from './heap.js';
import { getBit } from './grid.js';

// Node.hash: allow reuse the grid. nhash identifies unique search operation
let nhash = 0;

// |0|1|2|
// |7|n|3|
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
    return Math.floor(10 * (dx + dy) - 5.857 * Math.min(dx, dy));
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

function checkDir(node, target, dir) {
    let dx = target.x - node.x;
    let dy = target.y - node.y;
    if (dir == 1) return dx == 0 && dy < 0;
    if (dir == 3) return dx > 0 && dy == 0;
    if (dir == 5) return dx == 0 && dy > 0;
    if (dir == 7) return dx < 0 && dy == 0;
    if (dir == 0) return dx == dy && dx < 0;
    if (dir == 2) return dx == -dy && dx > 0;
    if (dir == 4) return dx == dy && dx > 0;
    if (dir == 6) return dx == -dy && dx < 0;
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
                    for (let j = 0; j <= distance; j++) {
                        const node = grid[best.y + p.v * j][best.x + p.h * j];
                        let distA = node.distances[dirA];
                        let distB = node.distances[dirB];

                        if (node.hash != nhash) resetNode(node, nhash);

                        if (distA) {
                            if (checkTarget(node, target, dirA, distA)) {
                                if (j) node.parent = best;
                                target.parent = node;
                                return generatePath(target);
                            }

                            if (getBit(node, dirA)) {
                                let next = getNext(grid, node, distA, dirA);
                                if (next.hash != nhash) resetNode(next, nhash);

                                let g = best.g + j * Math.SQRT2; // h**2 = c1**2 + c2**2 (h > c)
                                if (j) node.parent = best;
                                node.g = g;
                                g = node.g + distA;
                                if (next.inClose || (next.inOpen && next.g <= g)) continue;

                                next.parent = node;
                                next.g = g;
                                next.f = g + getH(next, x1, y1);

                                if (!next.inOpen) {
                                    next.inOpen = true;
                                    next.inClose = false;
                                    openSet.push(next);
                                }
                            }

                        }

                        if (distB) {
                            if (checkTarget(node, target, dirB, distB)) {
                                if (j) node.parent = best;
                                target.parent = node;
                                return generatePath(target);
                            }

                            if (getBit(node, dirB)) {
                                let next = getNext(grid, node, distB, dirB);
                                if (next.hash != nhash) resetNode(next, nhash);

                                let g = best.g + j * Math.SQRT2;
                                if (j) node.parent = best;
                                node.g = g;
                                g = node.g + distB;
                                if (next.inClose || (next.inOpen && next.g <= g)) continue;

                                next.parent = node;
                                next.g = g;
                                next.f = g + getH(next, x1, y1);

                                if (!next.inOpen) {
                                    next.inOpen = true;
                                    next.inClose = false;
                                    openSet.push(next);
                                }
                            }
                        }
                    }
                }

                // ends on jump
                if (d%2 != 0 && getBit(best, d)) {
                    let next = getNext(grid, best, distance, d);
                    if (next.hash != nhash) resetNode(next, nhash);

                    let g = best.g + distance;
                    if (next.inClose || (next.inOpen && next.g <= g)) continue;

                    next.parent = best;
                    next.g = g;
                    next.f = g + getH(next, x1, y1);

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

export { getPath };