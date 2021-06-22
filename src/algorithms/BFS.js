function bfs(startNode) {
  let path = [];
  let visitedNodes = [];
  let queue = [];
  queue.push(startNode);
  let current = null;
  while (queue.length > 0) {
    current = queue.shift();
    if (current.isEnd) {
      reconstructPath(current, path);
      return { path, visitedNodes };
    }
    visitedNodes.push(current);
    current.neighbours.forEach((neighbour) => {
      if (
        !visitedNodes.includes(neighbour) &&
        !queue.includes(neighbour) &&
        !neighbour.isWall
      ) {
        queue.push(neighbour);
        neighbour.previous = current;
      }
    });
  }
  return { path, visitedNodes, error: "No Path found!" };
}

function reconstructPath(endNode, path) {
  let temp = endNode;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }
  return path;
}

export default bfs;
