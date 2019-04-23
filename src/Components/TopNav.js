import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Form, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

class TopNav extends React.Component {
  render() {
    return (
      <Navbar bg="light" expand="lg">
        <LinkContainer to="/">
          <Navbar className="Brand nav-link">Find Bad Tweets</Navbar>
        </LinkContainer>
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <NavLink className="nav-link" to="/about">
              About
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default TopNav;
