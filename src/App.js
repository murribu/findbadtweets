import React from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "./Components/Routes";
import TopNav from "./Components/TopNav";

class App extends React.Component {
  render() {
    const childProps = {};
    return (
      <div className="App">
        <TopNav />
        <Routes childProps={childProps} />
      </div>
    );
  }
}

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default () => <AppWithRouter />;
