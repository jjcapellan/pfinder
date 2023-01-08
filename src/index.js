/**
* @copyright    2023 Juan Jose Capellan
* @license      {@link https://github.com/jjcapellan/pfinder/blob/master/LICENSE | MIT License}
*/

import { makeGrid } from './grid.js';
import { getPath } from './path.js';
import { getPathFromCache, setMaxCacheSize } from './cache.js';

if (typeof window != 'undefined') {
    globalThis.Pfinder = {
        getPath: getPath,
        getPathFromCache: getPathFromCache,
        makeGrid: makeGrid,
        setMaxCacheSize: setMaxCacheSize
    };
}

export { getPath, getPathFromCache, makeGrid, setMaxCacheSize };