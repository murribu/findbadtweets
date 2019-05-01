import React from "react";
import ProfileComponent from "./ProfileComponent";

describe("Profile Component", () => {
  it("should load without crashing", () => {
    const wrapper = shallow(<ProfileComponent />);
  });
  it("should load my data, when I'm viewing my own profile", async () => {
    const props = {
      profile: {
        displayName: "CJ Cregg",
        email: "ccregg@whitehouse.gov"
      },
      sub: "us-east-1:EFGH-2345",
      match: { params: { id: "EFGH-2345" } }
    };
    const profileComponent = shallow(<ProfileComponent {...props} />);
    const instance = profileComponent.instance();
    await instance.getProfile();
    expect(instance.state.profile.displayName).toEqual("CJ Cregg");
    expect(instance.state.profile.email).toEqual("ccregg@whitehouse.gov");
    expect(instance.state.serverProfile.displayName).toEqual("CJ Cregg");
    expect(instance.state.serverProfile.email).toEqual("ccregg@whitehouse.gov");
  });
  it("should load the user's data, when I'm viewing their profile", async () => {
    const props = {
      profile: {
        displayName: "CJ Cregg",
        email: "ccregg@whitehouse.gov"
      },
      sub: "us-east-1:EFGH-2345",
      match: { params: { id: "IJKL-4567" } }
    };
    const profileComponent = shallow(<ProfileComponent {...props} />);
    const instance = profileComponent.instance();
    await instance.getProfile();
    expect(instance.state.profile.displayName).toEqual("Leo Mcgarry");
    expect(instance.state.serverProfile.displayName).toEqual("Leo Mcgarry");
  });
});
