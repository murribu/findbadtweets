import { mount, render, shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

global.mount = mount;
global.render = render;
global.shallow = shallow;

const AuthMock = {
  currentAuthenticatedUser: jest.fn()
};
global.Auth = AuthMock;
