const generateMaze = (grid) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [0, 2],
    [2, 0],
    [0, -2],
    [-2, 0],
  ];

  const isInBounds = (x, y) => x > 0 && x < rows - 1 && y > 0 && y < cols - 1;

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const dfs = (x, y) => {
    grid[x][y].isWall = false; // Mark the current cell as part of the maze
    const shuffledDirections = shuffle(directions);

    for (const [dx, dy] of shuffledDirections) {
      const nx = x + dx;
      const ny = y + dy;

      if (isInBounds(nx, ny) && grid[nx][ny].isWall) {
        const betweenX = x + dx / 2;
        const betweenY = y + dy / 2;

        grid[betweenX][betweenY].isWall = false; // Mark the cell between as part of the maze
        dfs(nx, ny);
      }
    }
  };

  // Initialize all cells as walls
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j].isWall = true;
    }
  }

  // Start DFS from (1, 1) to avoid the borders
  dfs(1, 1);

  // Ensure there is a path from (1, 1) to (rows-2, cols-2)
  let x = 1, y = 1;
  while (x < rows - 2 || y < cols - 2) {
    grid[x][y].isWall = false;
    if (x < rows - 2) {
      x++;
    }
    if (y < cols - 2) {
      y++;
    }
  }
  grid[rows - 2][cols - 2].isWall = false; // Ensure end point is not a wall

  return grid;
};

export default generateMaze;
