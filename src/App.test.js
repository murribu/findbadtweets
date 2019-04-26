import React from "react";
import { MemoryRouter } from "react-router";
import AboutComponent from "./Components/Pages/AboutComponent";
import HomeComponent from "./Components/Pages/HomeComponent";
import NotFoundComponent from "./Components/Pages/NotFoundComponent";
import { App } from "./App";
import Amplify from "aws-amplify";

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
  it("should have a sub in its state when logged in", async () => {
    const app = shallow(<App />);

    global.loggedIn = true;
    jest.mock("aws-amplify");

    await app.instance().loadUserIfLoggedIn();

    expect(Amplify.Auth.currentAuthenticatedUser).toHaveBeenCalled();
    expect(app.state().sub).not.toBeNull();
  });
  it("should have a null sub in its state when not logged in", async () => {
    jest.mock("aws-amplify");
    global.loggedIn = false;

    const app = shallow(<App />);
    await app.instance().loadUserIfLoggedIn();

    console.log(app.state());
    expect(Amplify.Auth.currentAuthenticatedUser).toHaveBeenCalled();
    expect(app.state().sub).toBeNull();
  });
});
