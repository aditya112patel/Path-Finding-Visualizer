const dijkstraShortestPath = (grid, start, end) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
  
    class PriorityQueue {
        constructor(comparator = (a, b) => a < b) {
          this.elements = [];
          this.comparator = comparator;
        }
      
        enqueue(element) {
          this.elements.push(element);
          this.elements.sort((a, b) => this.comparator(a.distance, b.distance));
        }
      
        dequeue() {
          return this.elements.shift();
        }
      
        isEmpty() {
          return this.elements.length === 0;
        }
      }
      

    // Priority queue implementation for Dijkstra's algorithm
    const priorityQueue = new PriorityQueue((a, b) => a.distance < b.distance);
    const startNode = grid[start.x][start.y];
    startNode.distance = 0;
    priorityQueue.enqueue(startNode);
  
    // While there are nodes to process in the queue
    while (!priorityQueue.isEmpty()) {
      const current = priorityQueue.dequeue();
  
      // Mark current node as visited
      current.isVisited = true;
  
      // If reached the end node, reconstruct and return the path
      if (current.x === end.x && current.y === end.y) {
        const path = [];
        let step = current;
        while (step !== null) {
          path.push({ x: step.x, y: step.y });
          step = step.previousNode;
        }
        path.reverse();
        return { path, visitedNodes: grid.flat().filter(node => node.isVisited) };
      }
  
      // Explore neighbors
      for (const [dx, dy] of directions) {
        const nx = current.x + dx;
        const ny = current.y + dy;
  
        if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
          const neighbor = grid[nx][ny];
  
          // Skip walls
          if (neighbor.isWall || neighbor.isVisited) {
            continue;
          }
  
          const newDistance = current.distance + 1; // Uniform weight for grid edges
  
          if (newDistance < neighbor.distance) {
            neighbor.distance = newDistance;
            neighbor.previousNode = current;
            priorityQueue.enqueue(neighbor);
          }
        }
      }
    }
  
    return { path: null, visitedNodes: grid.flat().filter(node => node.isVisited) }; // No path found
  };
  

export default dijkstraShortestPath;