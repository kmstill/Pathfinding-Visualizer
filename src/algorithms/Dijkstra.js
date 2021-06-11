function dijkstra(startNode, unvisitedNodes) {
  let current = startNode;
  let visitedNodes = [];
  console.log("djisk");
  while (unvisitedNodes.length) {
    console.log("djisk");
    if (current.isEnd) {
      visitedNodes.push(current);
      const path = reconstructPath(current);
      return { visitedNodes, path };
    }
    let closestNeighbour = null;
    current.neighbours.forEach((neighbour) => {
      if (!visitedNodes.includes(neighbour) && !neighbour.isWall) {
        neighbour.distance = current.distance + (neighbour.isWeighted ? 2 : 1);
        if (
          closestNeighbour == null ||
          neighbour.distance < closestNeighbour.distance
        ) {
          closestNeighbour = neighbour;
        }
        neighbour.previous = current;
      }
    });
    visitedNodes.push(current);
    current = closestNeighbour;
  }
  let path = [];
  return { path, visitedNodes, error: "No Path found!" };
}

function getClosestNeighbour(node){
    
}

function reconstructPath(endNode) {
  let temp = endNode;
  let path = [];
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }
  return path;
}

export default dijkstra;
