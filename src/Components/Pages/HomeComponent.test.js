import React from "react";
import HomeComponent from "./HomeComponent";

describe("Home Component", () => {
  it("should load without crashing", () => {
    const wrapper = shallow(<HomeComponent />);
  });
});
