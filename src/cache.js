const cache = new Map();
let maxCacheSize = 1000;

function savePath(path, x0, y0, x1, y1) {
    if (cache.size > maxCacheSize) {
        cache.delete(cache.keys().next().value);
    }
    let key = x0 + '.' + y0 + '.' + x1 + '.' + y1;
    cache.set(key, path);
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

export { getPathFromCache, setMaxCacheSize };