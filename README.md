# Pfinder
Pathfinding library based on the A* algorithm.

---

## Features
* Suitable for 2d grids.
* Can be used in browser and Node.
* Minimal size: under 2Kb minified.
* Easy to use.
* No dependencies.
* Cacheable paths (optional)

---

## Installation
### Browser
There are two alternatives:
* Download the file [pfinder.min.js](https://cdn.jsdelivr.net/gh/jjcapellan/pfinder@0.3.0/dist/pfinder.min.js) to your proyect folder and add a reference in your html:
```html
<script src = "pfinder.js"></script>
```  
* Point a script tag to the CDN link:
```html
<script src = "https://cdn.jsdelivr.net/gh/jjcapellan/pfinder@0.3.0/dist/pfinder.min.js"></script>
```  
**Important**: The library methods are exposed into the global object **Pfinder**  
### NPM
```
npm i pfinder
```

---

## How to use
### Basic use:
```javascript
import * as Pfinder from 'pfinder';

// Representation of 2d space. (0 = walkable, 1 = obstacle). 
const map = [
    [0,1,0,0],
    [0,1,0,0],
    [0,0,0,1],
    [1,1,0,0]
    ];

// Transform the map to a grid of nodes
const grid = Pfinder.makeGrid(map);

// Search the path between (0,0) and (3,3)
let path = Pfinder.getPath(grid, 0, 0, 3, 3);

// getPath() returns the path as an array of points:
// [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 2}, {x: 2, y: 3}, {x: 3, y: 3}]
```
### Using cache:
For those cases where paths are frequently repeated, we can use **getPathFromCache()** instead of getPath(). This function first looks for the requested path in cache and if it does not find it, it calls the getPath() function and saves the new path.  
Depending on the case, **getPathFromCache()** can improve performance significantly, especially on large maps where few paths are frequently required.  
By default, the cache stores up to 1000 routes. Beyond this limit, the first saved route is deleted each time a new one is saved. By default, the cache stores up to 1000 routes. We can change this limit with the **setMaxCacheSize()** function.  

Example:
```javascript
import * as Pfinder from 'pfinder';

// Representation of 2d space. (0 = walkable, 1 = obstacle). 
const map = [
    [0,1,0,0],
    [0,1,0,0],
    [0,0,0,1],
    [1,1,0,0]
    ];

// Transform the map to a grid of nodes
const grid = Pfinder.makeGrid(map);

// All possible paths in this map are 256, so we could reduce the cache size (default = 1000) to save some memory and cover the 100% cases.
// In larger maps we'll look for a compromise between memory and performance.
Pfinder.setMaxCacheSize(256);

// Gets the path between (0,0) and (3,3) from cache if possible else calls to getPath() and saves the path in cache.
let path = Pfinder.getPathFromCache(grid, 0, 0, 3, 3);

// getPathFromCache() returns the path as an array of points:
// [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 2}, {x: 2, y: 3}, {x: 3, y: 3}]

```
**Important**: Each point of one path ({x,y}) has a size of 16 bytes. With this in mind, if necessary adjust the cache size to avoid "out of memory" errors.  

---

## API
### **makeGrid(map: number[][]) : Object[][]** 
Converts 2d array of numbers to 2d array of nodes.  
Parameters:
* *map*: 2d array of numbers representing a 2d space (0 = walkable, non 0 = obstacle).  

Returns:  
2d array of nodes used by other functions to search paths.
### **getPath(grid: Object[][], x0: number, y0: number, x1: number, y1: number): (Object[] | null)**
Calculates the required path.  
Parameters:
* *grid* : 2d array of nodes.
* *x0* : x-coordinate of the path origin.
* *y0* : y-coordinate of the path origin.
* *x1* : x-coordinate of the path end.
* *y1* : y-coordinate of the path end.  

Returns:  
Required path as an array of points (example: [{x: x0,y: y0}, {x: 2, y: 3}, ... , {x: x1, y: y1}]). If required path is not found, returns null.
### **getPathFromCache(grid: Object[][], x0: number, y0: number, x1: number, y1: number): (Object[] | null)**
Gets required path. Before calculating the path, searchs it in cache.Depending on the case, it can improve performance significantly, especially on large maps where few paths are frequently required.  

Parameters:
* *grid* : 2d array of nodes.
* *x0* : x-coordinate of the path origin.
* *y0* : y-coordinate of the path origin.
* *x1* : x-coordinate of the path end.
* *y1* : y-coordinate of the path end.  

Returns:  
Required path as an array of points (example: [{x: x0,y: y0}, {x: 2, y: 3}, ... , {x: x1, y: y1}]). If required path is not found, returns null.
### **setMaxCacheSize(size: number): void**
Sets the number of max stored paths in cache.  
Parameters:
* *size* : number of max stored paths in cache.  

---

## License
Pfinder is licensed under the terms of the MIT open source license.