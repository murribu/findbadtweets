import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getUser } from "../../graphql/queries";

class ProfileComponent extends React.Component {
  state = {
    profile: {
      displayName: null,
      email: null
    },
    serverProfile: {
      displayName: null,
      email: null
    },
    loading_profile: false
  };

  componentDidMount() {
    this.getProfile();
  }

  async getProfile() {
    if (this.props && this.props.sub && this.props.match) {
      if (this.props.match.params.id === this.props.sub.substring(10)) {
        // me!
        this.setState({
          profile: { ...this.props.profile },
          serverProfile: { ...this.props.profile }
        });
      } else {
        this.setState({ loading_profile: true });
        try {
          var { data } = await API.graphql(
            graphqlOperation(getUser, { user_id: this.props.sub.substring(10) })
          );
          this.setState({
            profile: { ...data.getUser },
            serverProfile: { ...data.getUser }
          });
        } catch (e) {
          console.log(e);
        } finally {
          this.setState({ loading_profile: false });
        }
      }
    }
    if (this.props && this.props.match && this.props.match.params) {
    }
  }

  render() {
    if (
      this.props &&
      this.props.sub &&
      this.props.match.params.id === this.props.sub.substring(10)
    ) {
      return (
        <div className="container text-center m-5">
          <h1>Your Profile</h1>
        </div>
      );
    } else {
      return <div className="container text-center m-5">Somebody Else</div>;
    }
  }
}

export default ProfileComponent;
