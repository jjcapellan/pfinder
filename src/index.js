const cache = new Map();
let maxCacheSize = 200;

function makeNode(x, y, isWall) {
    return {
        x: x,
        y: y,
        parent: null,
        children: [],
        isWall: isWall,
        g: 0,
        h: 0,
        f: 0
    };
}

function makeGrid(arr2d) {
    const width = arr2d.length;
    const height = arr2d[0].length;
    const map = [];

    // Populates map with nodes
    for (let y = 0; y < height; y++) {
        let row = new Array(width).fill(0);
        row.forEach((_, x) => {
            row[x] = makeNode(x, y, arr2d[y][x]);
        });
        map.push(row);
    }

    // Calc neighbours
    for (let i = 0; i < height; i++) {
        let row = map[i];
        row.forEach((n, idx) => {
            let children = [];
            let up = false, down = false, left = false, right = false;
            if (idx > 0) {
                children.push(row[idx - 1]);
                left = true;
            }
            if (idx < width - 1) {
                children.push(row[idx + 1]);
                right = true;
            }
            if (i > 0) {
                children.push(map[i - 1][idx]);
                up = true;
            }
            if (i < height - 1) {
                children.push(map[i + 1][idx]);
                down = true;
            }
            if (up && left) children.push(map[i - 1][idx - 1]);
            if (up && right) children.push(map[i - 1][idx + 1]);
            if (down && left) children.push(map[i + 1][idx - 1]);
            if (down && right) children.push(map[i + 1][idx + 1]);
            map[i][idx].children = children;
        });
    }

    return map;

}

function generatePath(node) {
    const path = [];
    let current = node;
    while (current) {
        path.push({ x: current.x, y: current.y });
        current = current.parent;
    }

    return path.reverse();
}

function getH(node, x1, y1) {
    let dx = Math.abs(node.x - x1);
    let dy = Math.abs(node.y - y1);
    return 10 * (dx + dy) - 5.857 * Math.min(dx, dy);
}

function savePath(path, x0, y0, x1, y1) {
    if (cache.size > maxCacheSize) {
        cache.delete(cache.keys().next().value);
    }
    let key = x0 + '.' + y0 + '.' + x1 + '.' + y1;
    cache.set(key, path);
}

function getPath(grid, x0, y0, x1, y1) {

    if (grid[y0][x0].isWall || grid[y1][x1].isWall) return null;

    let openSet = [];
    const closedSet = [];

    // Initial node
    openSet.push(grid[y0][x0]);

    while (openSet.length) {
        // Extract best node
        let bestNode = openSet[0];
        let idx = 0;
        openSet.forEach((n, i) => {
            if (n.f < bestNode.f) {
                bestNode = n;
                idx = i;
            }
        });

        // Move best from openSet to closedSet
        openSet.splice(idx, 1);
        closedSet.push(bestNode);

        // If solution found
        if (bestNode.x == x1 && bestNode.y == y1) {
            return generatePath(bestNode);
        }

        // Checks neighbors
        let children = bestNode.children;
        children.forEach(n => {
            if (n.isWall) return;
            if (closedSet.includes(n)) return;

            let g = bestNode.g + 1;
            if (n.g < g) {
                n.parent = bestNode;
                n.g = g;
                n.f = g + getH(n, x1, y1);
                if (!openSet.includes(n)) {
                    openSet.push(n);
                }
            }
        });

    }// end while

    return null;
}

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

function setMaxCacheSize(size) {
    maxCacheSize = size;
}

export { getPath, getPathFromCache, makeGrid, setMaxCacheSize };