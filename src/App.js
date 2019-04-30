import React from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "./Components/Routes";
import TopNav from "./Components/TopNav";

import Amplify, { graphqlOperation, Auth, API } from "aws-amplify";
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
    Auth.signOut()
      .then(() => {})
      .catch(err => console.log("Error on SignOut", err));
    this.setState({ sub: null, profile: { email: null, displayName: null } });
  };

  async loadUserIfLoggedIn() {
    var user;
    try {
      user = await Auth.currentAuthenticatedUser();
      this.setState({ sub: user.attributes.sub });
      var { data } = await API.graphql(graphqlOperation(getMyProfile));
      if (data.getMyProfile !== null) {
        this.handleUserSignIn(user.attributes.sub, {
          displayName: data.getMyProfile.displayName,
          email: user.attributes.email
        });
      } else {
        // I don't have a profile. Create one!
        var { data } = await API.graphql(
          graphqlOperation(updateUser, {
            displayName: user.attributes.email.substring(
              0,
              user.attributes.email.indexOf("@")
            ),
            email: user.attributes.email
          })
        );
        this.handleUserSignIn(user.attributes.sub, {
          displayName: data.updateUser.displayName,
          email: user.attributes.email
        });
      }
    } catch (e) {
      if (e !== "not authenticated") {
        throw e;
      }
    }
  }

  componentDidMount() {
    this.loadUserIfLoggedIn();
  }

  render() {
    const childProps = {
      signIn: this.signIn,
      loadUserIfLoggedIn: this.loadUserIfLoggedIn,
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
