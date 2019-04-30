import React from "react";
import { MemoryRouter } from "react-router";
import AboutComponent from "./Components/Pages/AboutComponent";
import HomeComponent from "./Components/Pages/HomeComponent";
import NotFoundComponent from "./Components/Pages/NotFoundComponent";
import { App } from "./App";
import Amplify from "aws-amplify";
import { updateUser } from "./graphql/mutations";

// test("invalid path should redirect to 404", () => {
//   const wrapper = mount(
//     <MemoryRouter initialEntries={["/random"]}>
//       <App />
//     </MemoryRouter>
//   );
//   expect(wrapper.find(HomeComponent)).toHaveLength(0);
//   expect(wrapper.find(NotFoundComponent)).toHaveLength(1);
// });

// test("valid path should not redirect to 404", () => {
//   const wrapper = mount(
//     <MemoryRouter initialEntries={["/"]}>
//       <App />
//     </MemoryRouter>
//   );
//   expect(wrapper.find(HomeComponent)).toHaveLength(1);
//   expect(wrapper.find(NotFoundComponent)).toHaveLength(0);
// });
// test("about path should go to about page", () => {
//   const wrapper = mount(
//     <MemoryRouter initialEntries={["/about"]}>
//       <App />
//     </MemoryRouter>
//   );
//   expect(wrapper.find(AboutComponent)).toHaveLength(1);
// });

describe("App", () => {
  it("should load without crashing", () => {
    const wrapper = shallow(<App />);
  });
  it("handleUserSignIn should set the state appropriately", async () => {
    const sub = "ASDF-7890";
    const email = "sseaborn@whitehouse.gov";
    const displayName = "Sam Seaborn";
    const app = shallow(<App />);
    await app.instance().handleUserSignIn(sub, { email, displayName });

    expect(app.state().sub).toEqual(sub);
    expect(app.state().profile.email).toEqual(email);
    expect(app.state().profile.displayName).toEqual(displayName);
  });
  it("handleUserSignOut should sign you out when signed in", async () => {
    jest.mock("aws-amplify");
    global.signedIn = true;
    global.hasProfile = true;

    const app = shallow(<App />);
    await app.instance().handleUserSignOut();

    expect(app.state().sub).toBeNull();
  });
  it("handleUserSignOut should sign you out when signed out", async () => {
    jest.mock("aws-amplify");
    global.signedIn = false;

    const app = shallow(<App />);
    await app.instance().handleUserSignOut();

    expect(app.state().sub).toBeNull();
  });
  it("loadUserIfLoggedIn: when logged in, should have a sub in its state", async () => {
    const app = shallow(<App />);

    global.signedIn = true;
    jest.mock("aws-amplify");

    await app.instance().loadUserIfLoggedIn();

    expect(Amplify.Auth.currentAuthenticatedUser).toHaveBeenCalled();
    expect(app.state().sub).not.toBeNull();
  });
  it("loadUserIfLoggedIn: when not logged in, should have a null sub in its state", async () => {
    jest.mock("aws-amplify");
    global.signedIn = false;

    const app = shallow(<App />);
    await app.instance().loadUserIfLoggedIn();

    expect(Amplify.Auth.currentAuthenticatedUser).toHaveBeenCalled();
    expect(app.state().sub).toBeNull();
  });
  it("loadUserIfLoggedIn: when logged in and there is no profile, should create a profile and store it in state", async () => {
    jest.mock("aws-amplify");
    global.signedIn = true;
    global.hasProfile = false;

    const app = shallow(<App />);
    await app.instance().loadUserIfLoggedIn();

    expect(Amplify.API.graphql).toHaveBeenCalledWith(updateUser);
    expect(global.hasProfile).toBeTruthy();
    expect(app.state().sub).not.toBeNull();
    expect(app.state().profile.email).not.toBeNull();
    expect(app.state().profile.displayName).not.toBeNull();
  });
  it("signIn: should login the user with correct credentials", async () => {
    jest.mock("aws-amplify");
    const app = shallow(<App />);
    const instance = app.instance();
    await instance.signIn("username@example.com", "password");
    expect(instance.state.sub).toEqual("ABCD-1234");
  });
});
