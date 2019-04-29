import React from "react";
import TopNav from "./TopNav";

const props = {
  handleUserSignOut: jest.fn(),
  sub: "ASDF-4561",
  profile: {
    displayName: "Josh Lymon",
    email: "jlymon@whitehouse.gov"
  }
};

describe("TopNav Component", () => {
  it("should load without crashing", () => {
    const wrapper = shallow(<TopNav />);
  });
  it("when logged in, should show 'welcome'", () => {
    const wrapper = shallow(<TopNav {...props} />);
    expect(wrapper.text()).toMatch(/Welcome/);
  });
});
