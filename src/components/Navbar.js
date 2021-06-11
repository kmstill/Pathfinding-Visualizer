import React from "react";
import { visualizePath, resetGrid } from "./Pathfind";
import * as ReactBootStrap from "react-bootstrap";

const Navbar = () => {
  return (
    <ReactBootStrap.Navbar bg="light" expand="lg">
      <ReactBootStrap.Container>
        <ReactBootStrap.Navbar.Brand href="#home">
          Pathfinding Visualizer
        </ReactBootStrap.Navbar.Brand>
        <ReactBootStrap.Navbar.Toggle aria-controls="basic-navbar-nav" />
        <ReactBootStrap.Navbar.Collapse id="basic-navbar-nav">
          <ReactBootStrap.Nav className="me-auto">
            <ReactBootStrap.NavDropdown
              title="Algorithms"
              id="algorithms-nav-dropdown"
            >
              <ReactBootStrap.NavDropdown.Item>
                Breadth First Search
              </ReactBootStrap.NavDropdown.Item>
              <ReactBootStrap.NavDropdown.Item>
                Depth First Search
              </ReactBootStrap.NavDropdown.Item>
              <ReactBootStrap.NavDropdown.Item>
                A*
              </ReactBootStrap.NavDropdown.Item>
              <ReactBootStrap.NavDropdown.Item>
                Dijkstra's
              </ReactBootStrap.NavDropdown.Item>
              <ReactBootStrap.NavDropdown.Divider />
            </ReactBootStrap.NavDropdown>
            <ReactBootStrap.Button onClick={visualizePath}>
              Visualize!
            </ReactBootStrap.Button>
            <ReactBootStrap.Button onClick={resetGrid}>
              Reset Grid
            </ReactBootStrap.Button>
          </ReactBootStrap.Nav>
        </ReactBootStrap.Navbar.Collapse>
      </ReactBootStrap.Container>
    </ReactBootStrap.Navbar>
  );
};
export default Navbar;
