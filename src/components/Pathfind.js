import React, { useState, useEffect } from "react";
import Node from "./Node";
import bfs from "../algorithms/BFS";
import dfs from "../algorithms/DFS";
import Astar from "../algorithms/astar";
import dijkstra from "../algorithms/Dijkstra";
import produce from "immer";
import * as ReactBootStrap from "react-bootstrap";
import "./Pathfind.css";

const COLS = 30;
const ROWS = 30;
const Pathfind = () => {
  const [Grid, setGrid] = useState([]);
  const [nodeStartPos, setNodeStartPos] = useState([4, 4]);
  const [nodeEndPos, setNodeEndPos] = useState([ROWS - 4, COLS - 4]);
  const [visualizing, setVisualizing] = useState(false);
  const [clickedPos, setClickedPos] = useState([-1, -1]); //[-1, -1] means no position has been clicked

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const grid = new Array(ROWS);
    for (let i = 0; i < ROWS; i++) {
      grid[i] = new Array(COLS);
    }
    createSpots(grid);
    setGrid(grid);
    addNeighbours(grid);
  };

  const createSpots = (grid) => {
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        grid[i][j] = new Spot(i, j);
      }
    }
  };

  const addNeighbours = (grid) => {
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        grid[i][j].addneighbours(grid);
      }
    }
  };

  function Spot(i, j) {
    this.row = i;
    this.col = j;
    this.isStart = this.row === nodeStartPos[0] && this.col === nodeStartPos[1];
    this.isEnd = this.row === nodeEndPos[0] && this.col === nodeEndPos[1];
    this.isWall = false;
    //this.isWeighted = false;
    this.g = 0;
    this.f = 0;
    this.h = 0;
    //this.distance = Infinity; //used for dijkstra
    //this.isVisited = false; //used for dijkstra
    this.previous = undefined;
    this.neighbours = [];
    this.addneighbours = function (grid) {
      let i = this.row;
      let j = this.col;
      if (i > 0) this.neighbours.push(grid[i - 1][j]);
      if (j < COLS - 1) this.neighbours.push(grid[i][j + 1]);
      if (i < ROWS - 1) this.neighbours.push(grid[i + 1][j]);
      if (j > 0) this.neighbours.push(grid[i][j - 1]);
    };
  }

  const handleMouseUp = () => {
    setClickedPos([-1, -1]);
  };

  const handleMouseDown = (row, col) => {
    setClickedPos([row, col]);
  };

  useEffect(() => {
    const clickedRow = clickedPos[0];
    const clickedCol = clickedPos[1];
    handleMouseEnter(clickedRow, clickedCol);
  }, [clickedPos]);

  const handleMouseEnter = (row, col) => {
    if (JSON.stringify(clickedPos) === JSON.stringify([-1, -1])) {
      return;
    }
    const newGrid = produce(Grid, (GridCopy) => {
      let node = GridCopy[row][col];
      if (
        (!nodeStartPos[0] || !nodeEndPos[0] || node.isStart || node.isEnd) &&
        !node.isWall
      ) {
        modifyStartOrEnd(node);
      } else {
        modifyWall(node);
      }
    });
    setGrid(newGrid);
  };

  const modifyStartOrEnd = (node) => {
    if (visualizing) {
      return;
    }
    if (node.isStart) {
      node.isStart = false;
      setNodeStartPos([null, null]);
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node";
    } else if (node.isEnd) {
      node.isEnd = false;
      setNodeEndPos([null, null]);
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node";
    } else if (!nodeStartPos[0]) {
      node.isStart = true;
      setNodeStartPos([node.row, node.col]);
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node node-start";
    } else if (!nodeEndPos[0]) {
      node.isEnd = true;
      setNodeEndPos([node.row, node.col]);
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node node-end";
    }
  };

  const modifyWall = (node) => {
    if (visualizing || node.isStart || node.isEnd) {
      return;
    }
    if (node.isWall) {
      node.isWall = false;
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node";
    } else {
      node.isWall = true;
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node isWall";
    }
  };

  const visualizeShortestPath = (path) => {
    for (let i = 0; i < path.length; ++i) {
      setTimeout(() => {
        const node = path[i];
        if (!node.isStart && !node.isEnd) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }
      }, 10 * i);
    }
  };

  const visualizeVisitedNodes = (visitedNodes, path) => {
    for (let i = 0; i < visitedNodes.length; i++) {
      setTimeout(() => {
        const node = visitedNodes[i];
        if (!node.isStart && !node.isEnd) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, 20 * i);
    }
    setTimeout(() => {
      visualizeShortestPath(path);
      setVisualizing(false);
    }, 20 * visitedNodes.length);
  };

  const visualizeAlgorithm = (algorithm) => {
    if (visualizing || !nodeStartPos[0] || !nodeEndPos[0]) {
      return;
    }
    clearGrid(false);
    setVisualizing(true);
    const startNode = Grid[nodeStartPos[0]][nodeStartPos[1]];
    const endNode = Grid[nodeEndPos[0]][nodeEndPos[1]];
    let algorithmOutput = null;
    switch (algorithm) {
      case "BFS":
        algorithmOutput = bfs(startNode, endNode);
        break;
      case "DFS":
        algorithmOutput = dfs(startNode, endNode);
        break;
      case "A*":
        algorithmOutput = Astar(startNode, endNode);
        break;
      case "Dijkstra's":
        let allNodes = getAllNodes();
        algorithmOutput = dijkstra(startNode, allNodes);
        break;
      default:
        return;
    }
    visualizeVisitedNodes(algorithmOutput.visitedNodes, algorithmOutput.path);
  };

  const clearGrid = (clearWalls) => {
    if (visualizing) {
      return;
    }
    setClickedPos([-1, -1]);
    const newGrid = produce(Grid, (GridCopy) => {
      for (let i = 0; i < GridCopy.length; i++) {
        for (let j = 0; j < GridCopy[i].length; j++) {
          const node = GridCopy[i][j];
          if (clearWalls) {
            node.isWall = false;
            node.isWeighted = false;
          }
          node.g = 0;
          node.f = 0;
          node.h = 0;
          node.previous = undefined;
          const classes = node.isStart
            ? "node-start"
            : node.isEnd
            ? "node-end"
            : node.isWall && !clearWalls
            ? "isWall"
            : "";
          document.getElementById(
            `node-${node.row}-${node.col}`
          ).className = `node ${classes}`;
        }
      }
    });
    setGrid(newGrid);
  };

  const randomWalls = () => {
    if (visualizing) {
      return;
    }
    clearGrid(true);
    Grid.forEach((row) => {
      row.forEach((node) => {
        if (Math.random() > 0.7) {
          modifyWall(node);
        }
      });
    });
  };

  const getAllNodes = () => {
    let allNodes = [];
    Grid.forEach((row) => {
      row.forEach((node) => {
        allNodes.push(node);
      });
    });
    return allNodes;
  };

  const Navbar = () => {
    return (
      <ReactBootStrap.Navbar className="nav-space" bg="light" expand="lg">
        <ReactBootStrap.Container>
          <ReactBootStrap.Navbar.Toggle aria-controls="basic-navbar-nav" />
          <ReactBootStrap.Navbar.Collapse id="basic-navbar-nav">
            <ReactBootStrap.Nav className="me-auto">
              <ReactBootStrap.Button
                className="btn-space"
                onClick={() => {
                  visualizeAlgorithm("BFS");
                }}
              >
                BFS
              </ReactBootStrap.Button>
              <ReactBootStrap.Button
                className="btn-space"
                onClick={() => {
                  visualizeAlgorithm("DFS");
                }}
              >
                DFS
              </ReactBootStrap.Button>
              <ReactBootStrap.Button
                className="btn-space"
                onClick={() => {
                  visualizeAlgorithm("A*");
                }}
              >
                A*
              </ReactBootStrap.Button>
              <ReactBootStrap.Button
                className="btn-space"
                onClick={() => {
                  visualizeAlgorithm("Dijkstra's");
                }}
              >
                Dijkstra's
              </ReactBootStrap.Button>
              <ReactBootStrap.Button
                className="btn-space"
                onClick={() => {
                  clearGrid(true);
                }}
              >
                Clear Walls and Path
              </ReactBootStrap.Button>
              <ReactBootStrap.Button
                className="btn-space"
                onClick={() => {
                  clearGrid(false);
                }}
              >
                Clear Path Only
              </ReactBootStrap.Button>
              <ReactBootStrap.Button
                className="btn-space"
                onClick={() => {
                  randomWalls();
                }}
              >
                Randomize Walls
              </ReactBootStrap.Button>
            </ReactBootStrap.Nav>
          </ReactBootStrap.Navbar.Collapse>
        </ReactBootStrap.Container>
      </ReactBootStrap.Navbar>
    );
  };

  const gridWithNode = (
    <div>
      {Grid.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="rowWrapper">
            {row.map((col, colIndex) => {
              const { isStart, isEnd, isWall } = col;
              return (
                <Node
                  key={colIndex}
                  isStart={isStart}
                  isEnd={isEnd}
                  isWall={isWall}
                  row={rowIndex}
                  col={colIndex}
                  handleMouseDown={handleMouseDown}
                  handleMouseUp={handleMouseUp}
                  handleMouseEnter={handleMouseEnter}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="Wrapper">
      <Navbar />
      {gridWithNode}
    </div>
  );
};

export default Pathfind;
