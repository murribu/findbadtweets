import React from "react";
import SignIn from "./SignIn";

import Amplify from "aws-amplify";

const event = {
  preventDefault: jest.fn()
};

describe("SignIn", () => {
  it("should load without crashing", () => {
    const signIn = shallow(<SignIn />);
  });
  it("should invalidate an incomplete form", () => {
    const signIn = shallow(<SignIn />);
    expect(signIn.instance().validateForm()).not.toBeTruthy();
    signIn.instance().setState({ email: "jbartlett@whitehouse.gov" });
    expect(signIn.instance().validateForm()).not.toBeTruthy();
    signIn.instance().setState({ password: "password", email: "" });
    expect(signIn.instance().validateForm()).not.toBeTruthy();
  });
  it("should validate a complete form", () => {
    const signIn = shallow(<SignIn />);
    signIn
      .instance()
      .setState({ password: "password", email: "jbartlett@whitehouse.gov" });
    expect(signIn.instance().validateForm()).toBeTruthy();
  });
  it("should authenticate and load user upon correct submission", async () => {
    const props = {
      signIn: jest.fn()
    };
    jest.mock("aws-amplify");
    const signIn = shallow(<SignIn {...props} />);
    const instance = signIn.instance();
    instance.setState({ password: "password", email: "username@example.com" });
    await instance.handleSubmit(event);
    expect(instance.props.signIn).toHaveBeenCalled();
  });
  it("should change state when handleChange is called", () => {
    const event = {
      target: { id: "email", value: "mlandingham@whitehouse.gov" }
    };
    const signIn = shallow(<SignIn />);
    const instance = signIn.instance();
    instance.handleChange(event);
    expect(instance.state.email).toEqual("mlandingham@whitehouse.gov");
  });
});
