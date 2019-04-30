import React from "react";
import SignUp from "./SignUp";

const event = {
  preventDefault: jest.fn()
};

describe("Signup Component", () => {
  it("should load without crashing", () => {
    const wrapper = shallow(<SignUp />);
  });
  it("should invalidate an incomplete form", () => {
    const signUp = shallow(<SignUp />);
    expect(signUp.instance().validateForm()).not.toBeTruthy();
    signUp.instance().setState({ email: "jbartlett@whitehouse.gov" });
    expect(signUp.instance().validateForm()).not.toBeTruthy();
    signUp.instance().setState({ password: "password", email: "" });
    expect(signUp.instance().validateForm()).not.toBeTruthy();
    signUp.instance().setState({
      confirmPassword: "differentpassword",
      password: "password",
      email: "jbartlett@whitehouse.gov"
    });
    expect(signUp.instance().validateForm()).not.toBeTruthy();
  });
  it("should validate a complete form", () => {
    const signUp = shallow(<SignUp />);
    signUp.instance().setState({
      confirmPassword: "password",
      password: "password",
      email: "jbartlett@whitehouse.gov"
    });
    expect(signUp.instance().validateForm()).toBeTruthy();
  });
  it("should show an error message if the user already exists", async () => {
    jest.mock("aws-amplify");
    const signUp = shallow(<SignUp />);
    const instance = signUp.instance();
    instance.setState({
      confirmPassword: "password",
      password: "password",
      email: "alreadysignedup@example.com"
    });
    await instance.handleSubmit(event);
    expect(instance.state.newUser).toBeNull();
    expect(instance.state.errorMessage).toEqual(
      "An account with the given email already exists"
    );
  });
  it("should show the confirmation page after signing up", async () => {
    jest.mock("aws-amplify");
    const signUp = shallow(<SignUp />);
    const instance = signUp.instance();
    instance.setState({
      confirmPassword: "password",
      password: "password",
      email: "jbartlett@whitehouse.gov"
    });
    await instance.handleSubmit(event);
    expect(instance.state.newUser).not.toBeNull();
    expect(signUp.text()).toMatch(/Confirmation/);
  });
  it("should process the submission of the confirmation code", async () => {
    const props = {
      signIn: jest.fn(),
      history: []
    };
    jest.mock("aws-amplify");
    const signUp = shallow(<SignUp {...props} />);
    const instance = signUp.instance();
    instance.setState({ newUser: "new user" });
    expect(instance.validateConfirmationForm()).not.toBeTruthy();
    instance.setState({ confirmationCode: "123456" });
    expect(instance.validateConfirmationForm()).toBeTruthy();
    await instance.handleConfirmationSubmit(event);
    expect(instance.props.signIn).toHaveBeenCalled();
  });
});
