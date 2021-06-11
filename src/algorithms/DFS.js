function dfs(startNode) {
  let path = [];
  let visitedNodes = [];
  let stack = [];
  stack.push(startNode);
  let current = null;
  while (stack.length > 0) {
    current = stack.pop();
    if (current.isEnd) {
      let temp = current;
      path.push(temp);
      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }
      return { path, visitedNodes };
    }
    visitedNodes.push(current);
    current.neighbours.forEach((neighbour) => {
      if (
        !visitedNodes.includes(neighbour) &&
        !stack.includes(neighbour) &&
        !neighbour.isWall
      ) {
        stack.push(neighbour);
        neighbour.previous = current;
      }
    });
  }
  return { path, visitedNodes, error: "No Path found!" };
}
export default dfs;
