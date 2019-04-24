import React from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "./Components/Routes";
import TopNav from "./Components/TopNav";

import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";
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

class App extends React.Component {
  state = {
    isAuthenticating: false,
    sub: null,
    profile: {
      email: null,
      displayName: null
    }
  };

  handleUserSignIn = sub => {
    this.setState({ sub });
  };

  handleUserSignOut = () => {
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log("Error on SignOut", err));
    this.setState({ sub: null });
  };

  async componentDidMount() {
    var user;
    try {
      user = await Auth.currentAuthenticatedUser();
      console.log("Auth.currentAuthenticatedUser", user);
      var { data } = await API.graphql(graphqlOperation(getMyProfile));
      console.log("getMyProfile", data);
      if (!data || !data.getMyProfile) {
        // I don't have a profile. Create one!
        const updateProfileResponse = await API.graphql(
          graphqlOperation(updateUser, {
            email: user.attributes.email,
            displayName: user.attributes.email.substring(
              0,
              user.attributes.email.indexOf("@")
            )
          })
        );
        data = updateProfileResponse.data;
        this.setState({
          profile: {
            email: updateProfileResponse.email,
            displayName: updateProfileResponse.displayName
          }
        });
      }
      this.handleUserSignIn({
        displayName: data.getMyProfile.displayName,
        email: data.getMyProfile.email
      });
    } catch (e) {
      if (e !== "not authenticated") {
        throw e;
      }
    }
  }

  render() {
    const childProps = {
      handleUserSignIn: this.handleUserSignIn
    };
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
