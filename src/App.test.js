import React from "react";
import { MemoryRouter } from "react-router";
import HomeComponent from "./Components/Pages/HomeComponent";
import NotFoundComponent from "./Components/Pages/NotFoundComponent";
import App from "./App";

test("invalid path should redirect to 404", () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={["/random"]}>
      <App />
    </MemoryRouter>
  );
  expect(wrapper.find(HomeComponent)).toHaveLength(0);
  expect(wrapper.find(NotFoundComponent)).toHaveLength(1);
});

test("valid path should not redirect to 404", () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  expect(wrapper.find(HomeComponent)).toHaveLength(1);
  expect(wrapper.find(NotFoundComponent)).toHaveLength(0);
});

describe("Home Component", () => {
  it("should load without crashing", () => {
    const wrapper = shallow(<App />);
  });
});
