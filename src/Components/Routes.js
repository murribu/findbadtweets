import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";

import HomeComponent from "./Pages/HomeComponent";
import AboutComponent from "./Pages/AboutComponent";

const AuthRoute = ({ render: C, props: childProps, ...rest }) => {
  return childProps.isLoggedIn ? (
    <Route
      path="/auth"
      component={({ location }) => {
        return (
          <Redirect
            to={{
              pathname: `${
                location.search.substring(1).split("=").length > 1
                  ? location.search.substring(1).split("=")[1]
                  : `/`
              }`
            }}
          />
        );
      }}
    />
  ) : (
    <Route {...rest} render={rProps => <C {...rProps} {...childProps} />} />
  );
};

const ProppedRoute = ({ render: C, props: childProps, ...rest }) => (
  <Route {...rest} render={rProps => <C {...rProps} {...childProps} />} />
);

const Routes = ({ childProps }) => (
  <Switch>
    <AuthRoute exact path="/auth" render={SignIn} props={childProps} />
    <AuthRoute exact path="/auth/create" render={SignUp} props={childProps} />
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
