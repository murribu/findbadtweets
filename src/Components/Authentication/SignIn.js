import React from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./SignIn.css";
import "bootstrap/dist/css/bootstrap.css";

class SignIn extends React.Component {
  state = {
    isLoading: false,
    email: "",
    password: ""
  };

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ isLoading: true });
  };

  render() {
    return (
      <div className="Login">
        <Form onSubmit={this.handleSubmit} style={{ textAlign: "center" }}>
          <Form.Group controlId="email" bs-size="large">
            <Form.Control
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="password" bs-size="large">
            <Form.Control
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </Form.Group>
          <Button
            block
            bs-size="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
          <br />
          <Link className="btn btn-sm btn-primary" to="/auth/create">
            create an account
          </Link>
          <br />
          <div className="container">
            <div className="row">
              <div className="col-6 text-center">
                <Link to="/terms">Terms of Service</Link>
              </div>
              <div className="col-6 text-center">
                <Link to="/privacy">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default SignIn;
