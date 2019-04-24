import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Form, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

class TopNav extends React.Component {
  signOut(e) {
    e.preventDefault();
    this.props.handleUserSignOut();
  }

  render() {
    return (
      <Navbar bg="light" expand="lg">
        <LinkContainer to="/">
          <Navbar className="Brand nav-link">Find Bad Tweets</Navbar>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <NavLink className="nav-link" to="/about">
              About
            </NavLink>
          </Nav>
          <Form inline onSubmit={this.signOut}>
            <span className="mr-3">
              {this.props.sub ? "Welcome " : ""}
              <NavLink
                to={
                  "/profile/" +
                  (this.props.sub ? this.props.sub.substring(10) : "")
                }
              >
                {this.props.sub ? this.props.profile.displayName : ""}
              </NavLink>
            </span>
            {this.props.sub ? (
              <Button type="submit" variant="primary">
                Sign Out
              </Button>
            ) : (
              <NavLink className="nav-link" to="/auth">
                Sign In
              </NavLink>
            )}
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default TopNav;
