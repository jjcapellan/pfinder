# v0.4.0
+15% performance in 500x500 grid. In this version, by default the path doesnt cross between two corners. To get old behavior use <code>makeGrid(map, true)</code>.
## New features
* *makeGrid()*: accepts a second parammeter *allowCross*, if it is true allows path to cross between two corners.
## Improvements
* Removed closedSet array: there is a node property *isClose* instead.
* Node signature is made by a simple integer counter, instead of previus random numbers.

---

# v0.3.0
+80% performance in 500x500 grid.
## Improvements
* *makeGrid()*: not walkable nodes are removed from node.children.
* *inOpen* and *inClose* node properties avoids the use of *array.include* method inside *getPath()*.  

---

# v0.2.0
+200% performance in 500x500 grid.
## Improvements
* New openSet container: new **Head** class optimizes the array push behavior to get the grid node with min f. Using this class, *getPath()* improves its performance by +200% (tested in 500x500 grid).  

---

# v0.1.1
## Fixes
* Fix: grid nodes state is modified after call getPath(), so precalculated grid is not reusable. It was solved by creating a node signature for each call to the function, and resetting the node.  

---

# v0.1.0
First version.
## New features:
* Precalculated nodes: *makeGrid(map)* transforms the 2d map to a 2d grid of nodes. Each node contains coordinates and neighbors. This new array will be used by pathfinding functions. In this way, neighbors are calculated only one time.
* Basic pathfinfing: *getPath(grid,x0,y0,x1,y1)* search a path into the grid of nodes.
* Cache system: *getPathFromCache()* calculates paths only one time and saves it to cache. If same paths are required frequently it improves performance. Initial max cache size (number of paths stored) is 1000 (this limit can be changed using *setMaxCacheSize*).
