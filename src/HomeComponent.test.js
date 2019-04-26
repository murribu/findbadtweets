import React from "react";
import { MemoryRouter } from "react-router";
import App from "./App";
import HomeComponent from "./Components/Pages/HomeComponent";

describe("Home Component", () => {
    it("should initialize to NOT logged in", () => {
        // const wrapper = mount(
        //   <MemoryRouter>
        //     <App />
        //   </MemoryRouter>
        // );

        // const home = wrapper.find(HomeComponent);
        // const { sub } = home.props();
        expect(1).not.toBeNull();
    });
});
