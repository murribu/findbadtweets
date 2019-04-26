import React from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "./Components/Routes";
import TopNav from "./Components/TopNav";

import Amplify from "aws-amplify";
import config from "./config";

import { getMyProfile } from "./graphql/queries";
import { updateUser } from "./graphql/mutations";

Amplify.configure({
  Auth: {
    userPoolId: config.userpoolid,
    region: config.cognitoregion,
    identityPoolId: config.identitypoolid,
    userPoolWebClientId: config.webclientid
  },
  API: {
    aws_appsync_graphqlEndpoint: config.apiendpoint,
    aws_appsync_region: config.cognitoregion,
    aws_appsync_authenticationType: "AWS_IAM"
  }
});

export class App extends React.Component {
  state = {
    isAuthenticating: false,
    sub: null,
    profile: {
      email: null,
      displayName: null
    }
  };

  handleUserSignIn = (sub, profile) => {
    this.setState({ sub, profile });
  };

  handleUserSignOut = () => {
    Amplify.Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log("Error on SignOut", err));
    this.setState({ sub: null, profile: { email: null, displayName: null } });
  };

  async loadUserIfLoggedIn() {
    this.setState({
      loadUserIfLoggedInRunCount: this.state.loadUserIfLoggedInRunCount + 1
    });
    var user;
    try {
      user = await Amplify.Auth.currentAuthenticatedUser();
      console.log("Amplify.Auth.currentAuthenticatedUser", user);
      this.setState({ sub: user.attributes.sub });
      var { data } = await Amplify.API.graphql(
        Amplify.graphqlOperation(getMyProfile)
      );
      console.log("getMyProfile", data);
      this.setState({ getMyProfile: data });
      if (data) {
        this.handleUserSignIn(user.attributes.sub, data.getMyProfile);
      }
    } catch (e) {
      if (e !== "not authenticated") {
        throw e;
      }
    }
  }

  componentDidMount() {
    this.setState({ componentDidMountRan: true });
    this.loadUserIfLoggedIn();
  }

  render() {
    const childProps = {
      signIn: this.signIn,
      handleUserSignOut: this.handleUserSignOut,
      profile: this.state.profile,
      sub: this.state.sub
    };
    return (
      <div className="App">
        <TopNav {...childProps} />
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
