# v0.1.0
First version.
## New features:
* Precalculated nodes: *makeGrid(map)* transforms the 2d map to a 2d grid of nodes. Each node contains coordinates and neighbors. This new array will be used by pathfinding functions. In this way, neighbors are calculated only one time.
* Basic pathfinfing: *getPath(grid,x0,y0,x1,y1)* search a path into the grid of nodes.
* Cache system: *getPathFromCache()* calculates paths only one time and saves it to cache. If same paths are required frequently it improves performance. Initial max cache size (number of paths stored) is 1000 (this limit can be changed using *setMaxCacheSize*).
