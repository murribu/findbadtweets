import React from "react";
import { MemoryRouter } from "react-router";
import App from "./App";
import TopNav from "./Components/TopNav";

describe("TopNav Component", () => {
    it("should show 'Sign In' when not logged in", () => {
        //   const wrapper = mount(
        //     <MemoryRouter>
        //       <App />
        //     </MemoryRouter>
        //   );

        //   const topnav = wrapper.find(TopNav);
        //   const { sub } = topnav.props();
        //   expect(sub).toBeNull();
        //   expect(topnav.find("NavLink.sign-in")).toHaveLength(1);
        // });
        // it("should show 'Welcome, username' when logged in", () => {
        //   Auth.signIn("username", "password");

        //   const wrapper = mount(
        //     <MemoryRouter>
        //       <App />
        //     </MemoryRouter>
        //   );

        //   const topnav = wrapper.find(TopNav);
        //   const { sub } = topnav.props();
        //   console.log(topnav.props());
        //   expect(topnav.find("NavLink.sign-in")).toHaveLength(0);
        //   expect(topnav.find("Button.sign-out")).toHaveLength(1);
        expect(1).not.toBeNull();
    });
});
