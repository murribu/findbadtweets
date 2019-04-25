import React from "react";

class ProfileComponent extends React.Component {
  state = {
    profile: {
      displayName: null
    },
    serverProfile: {
      displayName: null
    },
    loading_profile: false
  };

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
