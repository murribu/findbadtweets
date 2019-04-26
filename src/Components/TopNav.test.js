import React from "react";
import TopNav from "./TopNav";

describe("TopNav Component", () => {
  it("should load without crashing", () => {
    const props = {
      handleUserSignOut: jest.fn(),
      sub: "ASDF-4561",
      profile: {
        displayName: "Josh Lymon",
        email: "jlymon@whitehouse.gov"
      }
    };
    const wrapper = shallow(<TopNav {...props} />);
  });
});
