/**
* @copyright    2023 Juan Jose Capellan
* @license      {@link https://github.com/jjcapellan/pfinder/blob/master/LICENSE | MIT License}
*/

import { Heap } from './heap.js';

let counter = 0;

function generatePath(node, x0, y0) {
    const path = [];
    let current = node;
    let i = 0;
    while (current) {
        path[i++] = { x: current.x, y: current.y };
        if (current.x == x0 && current.y == y0) break;
        current = current.parent;
    };

    return path.reverse();
}

function getH(node, x1, y1) {
    let dx = Math.abs(node.x - x1);
    let dy = Math.abs(node.y - y1);
    // h = D * (dx + dy) + (sqrt(D^2 + D^2) - 2 * D) * min(dx, dy)
    return (10 * (dx + dy) - 5.857 * Math.min(dx, dy));
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

    let signature = counter++;
    grid[y0][x0].signature = signature;
    grid[y0][x0].inOpen = false;
    grid[y0][x0].inClose = false;

    const openSet = new Heap('f', 100, 10);

    // Initial node
    openSet.push(grid[y0][x0]);

    while (openSet.count) {
        // Extract best node
        let bestNode = openSet.pop();
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

export { getPath };