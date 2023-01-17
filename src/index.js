/**
* @copyright    2023 Juan Jose Capellan
* @license      {@link https://github.com/jjcapellan/pfinder/blob/master/LICENSE | MIT License}
*/

import { makeGrid } from './grid.js';
import { getPath, getPathAsync, getMaxPathsPerFrame, setMaxPathsPerFrame, update } from './path.js';
import { getPathFromCache, setMaxCacheSize } from './cache.js';

if (typeof window != 'undefined') {
    globalThis.Pfinder = {
        getPath: getPath,
        getPathAsync: getPathAsync,
        getPathFromCache: getPathFromCache,
        makeGrid: makeGrid,
        setMaxCacheSize: setMaxCacheSize,
        setMaxPathsPerFrame: setMaxPathsPerFrame,
        update: update
    };
}

export { getPath, getPathAsync, getPathFromCache, getMaxPathsPerFrame, makeGrid, setMaxCacheSize, setMaxPathsPerFrame, update };