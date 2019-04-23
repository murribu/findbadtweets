import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import HomeComponent from "./Pages/HomeComponent";
import AboutComponent from "./Pages/AboutComponent";

const ProppedRoute = ({ render: C, props: childProps, ...rest }) => (
  <Route {...rest} render={rProps => <C {...rProps} {...childProps} />} />
);

const Routes = ({ childProps }) => (
  <Switch>
    <ProppedRoute exact path="/" render={HomeComponent} props={childProps} />
    <ProppedRoute
      exact
      path="/about"
      render={AboutComponent}
      props={childProps}
    />
  </Switch>
);

export default Routes;
