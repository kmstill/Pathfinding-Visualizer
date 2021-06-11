import React from "react";
import "./Node.css";
const Node = (props) => {
  const classes = props.isStart
    ? "node-start"
    : props.isWall
    ? "isWall"
    : props.isEnd
    ? "node-end"
    : "";
  return (
    <div
      className={`node ${classes}`}
      id={`node-${props.row}-${props.col}`}
      onMouseDown={() => props.handleMouseDown(props.row, props.col)}
      onMouseUp={() => props.handleMouseUp()}
      onMouseEnter={() => props.handleMouseEnter(props.row, props.col)}
    ></div>
  );
};

export default Node;
